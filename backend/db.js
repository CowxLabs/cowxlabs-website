import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, 'cowxlabs.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin','employee','client')),
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    client_id INTEGER,
    employee_id INTEGER,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning','in_progress','on_hold','completed','cancelled')),
    deadline TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','review','done')),
    due_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    project_id INTEGER,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','cancelled')),
    issued_date TEXT NOT NULL DEFAULT (date('now')),
    due_date TEXT,
    notes TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
`);

function seed() {
  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (userCount > 0) return;

  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, ?, ?)'
  );
  const hash = (p) => bcrypt.hashSync(p, 10);

  const adminId = insertUser.run('Site Admin', 'admin@cowxlabs.com', hash('admin123'), 'admin', 1).lastInsertRowid;
  const empId = insertUser.run('Jane Developer', 'employee@cowxlabs.com', hash('employee123'), 'employee', 1).lastInsertRowid;
  const clientUserId = insertUser.run('Bob Client', 'client@cowxlabs.com', hash('client123'), 'client', 1).lastInsertRowid;

  const insertClient = db.prepare(
    'INSERT INTO clients (user_id, company_name, contact_name, email, phone, notes) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const clientId = insertClient.run(
    clientUserId, 'Acme Corporation', 'Bob Client', 'client@acme.com', '+1 555 0100', 'Long-term partner.'
  ).lastInsertRowid;

  const insertProject = db.prepare(
    'INSERT INTO projects (name, description, client_id, employee_id, status, deadline) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const p1 = insertProject.run('CRM Platform', 'Custom CRM for sales team.', clientId, empId, 'in_progress', '2026-09-30').lastInsertRowid;
  const p2 = insertProject.run('Inventory API', 'REST API for warehouse stock.', clientId, empId, 'planning', '2026-11-15').lastInsertRowid;

  const insertTask = db.prepare(
    'INSERT INTO tasks (project_id, title, description, assigned_to, status, due_date) VALUES (?, ?, ?, ?, ?, ?)'
  );
  insertTask.run(p1, 'Design database schema', 'Model customers, leads, orders.', empId, 'done', '2026-08-01');
  insertTask.run(p1, 'Build auth service', 'JWT login for staff.', empId, 'in_progress', '2026-08-20');
  insertTask.run(p2, 'Requirements gathering', 'Workshop with client.', empId, 'todo', '2026-09-10');

  const insertInvoice = db.prepare(
    'INSERT INTO invoices (client_id, project_id, amount, currency, status, issued_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  insertInvoice.run(clientId, p1, 4500.00, 'USD', 'pending', '2026-07-01', '2026-07-31');
  insertInvoice.run(clientId, p1, 3200.00, 'USD', 'paid', '2026-06-01', '2026-06-30');

  const insertService = db.prepare(
    'INSERT INTO services (title, description, icon, sort_order) VALUES (?, ?, ?, ?)'
  );
  insertService.run('Custom Software', 'Bespoke web & mobile apps tailored to your business workflows.', 'code', 1);
  insertService.run('Cloud & DevOps', 'Deploy, scale and monitor your systems on modern cloud infrastructure.', 'cloud', 2);
  insertService.run('Data & Analytics', 'Turn raw data into dashboards and decisions with ETL and BI.', 'chart', 3);
  insertService.run('Consulting', 'Architecture reviews, audits and fractional CTO guidance.', 'compass', 4);
  insertService.run('Support & Maintenance', 'Ongoing monitoring, SLAs and feature iterations.', 'shield', 5);
}

seed();

export default db;
