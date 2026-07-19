import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Postgres connection cannot start.');
  process.exit(1);
}

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

pool.on('error', (err) => {
  console.error('Unexpected Postgres pool error:', err);
});

// Convert SQLite-style "?" placeholders to Postgres "$1, $2, ...".
function toPg(sql, params = []) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

// Wrap a single statement so callers can keep using .get()/.all()/.run().
function wrap(text, params) {
  const sql = toPg(text, params);
  return {
    async get(...args) {
      const { rows } = await pool.query(sql, args);
      return rows[0] || null;
    },
    async all(...args) {
      const { rows } = await pool.query(sql, args);
      return rows;
    },
    async run(...args) {
      const { rows } = await pool.query(
        `${sql} RETURNING id`,
        args
      );
      const insertedId = rows[0]?.id ?? null;
      return { lastInsertRowid: insertedId, changes: rows.length };
    }
  };
}

export default {
  query: (text, params) => pool.query(text, params),
  prepare: (text) => wrap(text),
  get: (text, params) => wrap(text).get(...(params || [])),
  all: (text, params) => wrap(text).all(...(params || [])),
  run: (text, params) => wrap(text).run(...(params || [])),
  pool
};

// ---------- Schema ----------
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin','employee','client')),
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (NOW()::text)
  );

  CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (NOW()::text),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    client_id INTEGER,
    employee_id INTEGER,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning','in_progress','on_hold','completed','cancelled')),
    deadline TEXT,
    created_at TEXT NOT NULL DEFAULT (NOW()::text),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','review','done')),
    due_date TEXT,
    created_at TEXT NOT NULL DEFAULT (NOW()::text),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    client_id INTEGER,
    project_id INTEGER,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','cancelled')),
    issued_date TEXT NOT NULL DEFAULT (CURRENT_DATE::text),
    due_date TEXT,
    notes TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied')),
    created_at TEXT NOT NULL DEFAULT (NOW()::text)
  );

  CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
`;

async function seed() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS c FROM users');
  if (rows[0].c > 0) return;

  const hash = (p) => bcrypt.hashSync(p, 10);
  const insertUser = 'INSERT INTO users (name, email, password_hash, role, active) VALUES ($1,$2,$3,$4,1) RETURNING id';
  const adminId = (await pool.query(insertUser, ['Site Admin', 'admin@cowxlabs.com', hash('Jackson2020!'), 'admin'])).rows[0].id;
  const empId = (await pool.query(insertUser, ['Jane Developer', 'employee@cowxlabs.com', hash('Jackson2020!'), 'employee'])).rows[0].id;
  const clientUserId = (await pool.query(insertUser, ['Bob Client', 'client@cowxlabs.com', hash('Jackson2020!'), 'client'])).rows[0].id;

  const clientId = (await pool.query(
    'INSERT INTO clients (user_id, company_name, contact_name, email, phone, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
    [clientUserId, 'Acme Corporation', 'Bob Client', 'client@acme.com', '+1 555 0100', 'Long-term partner.']
  )).rows[0].id;

  const p1 = (await pool.query(
    "INSERT INTO projects (name, description, client_id, employee_id, status, deadline) VALUES ($1,$2,$3,$4,'in_progress',$5) RETURNING id",
    ['CRM Platform', 'Custom CRM for sales team.', clientId, empId, '2026-09-30']
  )).rows[0].id;
  const p2 = (await pool.query(
    "INSERT INTO projects (name, description, client_id, employee_id, status, deadline) VALUES ($1,$2,$3,$4,'planning',$5) RETURNING id",
    ['Inventory API', 'REST API for warehouse stock.', clientId, empId, '2026-11-15']
  )).rows[0].id;

  await pool.query(
    'INSERT INTO tasks (project_id, title, description, assigned_to, status, due_date) VALUES ($1,$2,$3,$4,$5,$6)',
    [p1, 'Design database schema', 'Model customers, leads, orders.', empId, 'done', '2026-08-01']
  );
  await pool.query(
    'INSERT INTO tasks (project_id, title, description, assigned_to, status, due_date) VALUES ($1,$2,$3,$4,$5,$6)',
    [p1, 'Build auth service', 'JWT login for staff.', empId, 'in_progress', '2026-08-20']
  );
  await pool.query(
    'INSERT INTO tasks (project_id, title, description, assigned_to, status, due_date) VALUES ($1,$2,$3,$4,$5,$6)',
    [p2, 'Requirements gathering', 'Workshop with client.', empId, 'todo', '2026-09-10']
  );

  await pool.query(
    'INSERT INTO invoices (client_id, project_id, amount, currency, status, issued_date, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [clientId, p1, 4500.0, 'USD', 'pending', '2026-07-01', '2026-07-31']
  );
  await pool.query(
    'INSERT INTO invoices (client_id, project_id, amount, currency, status, issued_date, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [clientId, p1, 3200.0, 'USD', 'paid', '2026-06-01', '2026-06-30']
  );

  const services = [
    ['Custom Software', 'Bespoke web & mobile apps tailored to your business workflows.', 'code', 1],
    ['Cloud & DevOps', 'Deploy, scale and monitor your systems on modern cloud infrastructure.', 'cloud', 2],
    ['Data & Analytics', 'Turn raw data into dashboards and decisions with ETL and BI.', 'chart', 3],
    ['Consulting', 'Architecture reviews, audits and fractional CTO guidance.', 'compass', 4],
    ['Support & Maintenance', 'Ongoing monitoring, SLAs and feature iterations.', 'shield', 5]
  ];
  for (const [title, description, icon, sort_order] of services) {
    await pool.query(
      'INSERT INTO services (title, description, icon, sort_order) VALUES ($1,$2,$3,$4)',
      [title, description, icon, sort_order]
    );
  }
}

export async function initDb() {
  await pool.query(SCHEMA);
  await seed();
  console.log('Postgres schema initialized.');
}
