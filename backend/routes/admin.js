import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { authenticate, requireRole, getUserById } from '../auth.js';

const router = Router();
router.use(authenticate, requireRole('admin'));

router.get('/stats', async (req, res) => {
  const stats = {
    users: (await db.prepare("SELECT COUNT(*) AS c FROM users WHERE role != 'admin'").get()).c,
    employees: (await db.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'employee'").get()).c,
    clients: (await db.prepare('SELECT COUNT(*) AS c FROM clients').get()).c,
    projects: (await db.prepare('SELECT COUNT(*) AS c FROM projects').get()).c,
    activeProjects: (await db.prepare("SELECT COUNT(*) AS c FROM projects WHERE status = 'in_progress'").get()).c,
    invoicesOutstanding: (await db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM invoices WHERE status = 'pending'").get()).s,
    openTasks: (await db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE status != 'done'").get()).c
  };
  res.json(stats);
});

// ---- Users ----
router.get('/users', async (req, res) => {
  const users = await db
    .prepare('SELECT id, name, email, role, active, created_at FROM users ORDER BY created_at DESC')
    .all();
  res.json(users);
});

router.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields required' });
  }
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email exists' });
  const hash = bcrypt.hashSync(password, 10);
  const info = await db
    .prepare('INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, ?, 1)')
    .run(name, email, hash, role);
  res.status(201).json(await getUserById(info.lastInsertRowid));
});

router.patch('/users/:id', async (req, res) => {
  const { name, email, role, active, password } = req.body || {};
  const user = await db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const newName = name ?? user.name;
  const newEmail = email ?? user.email;
  const newRole = role ?? user.role;
  const newActive = active === undefined ? user.active : (active ? 1 : 0);
  let sql = 'UPDATE users SET name=?, email=?, role=?, active=? WHERE id=?';
  const params = [newName, newEmail, newRole, newActive, user.id];
  if (password) {
    sql = 'UPDATE users SET name=?, email=?, role=?, active=?, password_hash=? WHERE id=?';
    params.splice(4, 0, bcrypt.hashSync(password, 10));
  }
  await db.prepare(sql).run(...params);
  res.json(await getUserById(user.id));
});

router.delete('/users/:id', async (req, res) => {
  await db.prepare('DELETE FROM users WHERE id = ? AND role != ?').run(req.params.id, 'admin');
  res.json({ ok: true });
});

// ---- Clients ----
router.get('/clients', async (req, res) => {
  const clients = await db.prepare('SELECT * FROM clients ORDER BY company_name').all();
  res.json(clients);
});

router.post('/clients', async (req, res) => {
  const { company_name, contact_name, email, phone, notes, user_id } = req.body || {};
  if (!company_name) return res.status(400).json({ error: 'Company name required' });
  const info = await db
    .prepare('INSERT INTO clients (user_id, company_name, contact_name, email, phone, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run(user_id || null, company_name, contact_name || null, email || null, phone || null, notes || null);
  res.status(201).json(await db.prepare('SELECT * FROM clients WHERE id = ?').get(info.lastInsertRowid));
});

router.patch('/clients/:id', async (req, res) => {
  const c = await db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Client not found' });
  const b = req.body || {};
  await db.prepare(`UPDATE clients SET company_name=?, contact_name=?, email=?, phone=?, notes=? WHERE id=?`)
    .run(
      b.company_name ?? c.company_name,
      b.contact_name ?? c.contact_name,
      b.email ?? c.email,
      b.phone ?? c.phone,
      b.notes ?? c.notes,
      c.id
    );
  res.json(await db.prepare('SELECT * FROM clients WHERE id = ?').get(c.id));
});

router.delete('/clients/:id', async (req, res) => {
  await db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---- Projects ----
router.get('/projects', async (req, res) => {
  const projects = await db.prepare(`
    SELECT p.*, c.company_name AS client_name,
      (SELECT name FROM users WHERE id = p.employee_id) AS employee_name
    FROM projects p LEFT JOIN clients c ON p.client_id = c.id
    ORDER BY p.created_at DESC
  `).all();
  res.json(projects);
});

router.post('/projects', async (req, res) => {
  const { name, description, client_id, employee_id, status, deadline } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Name required' });
  const info = await db
    .prepare('INSERT INTO projects (name, description, client_id, employee_id, status, deadline) VALUES (?, ?, ?, ?, ?, ?)')
    .run(name, description || null, client_id || null, employee_id || null, status || 'planning', deadline || null);
  res.status(201).json(await db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid));
});

router.patch('/projects/:id', async (req, res) => {
  const p = await db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  const b = req.body || {};
  await db.prepare(`UPDATE projects SET name=?, description=?, client_id=?, employee_id=?, status=?, deadline=? WHERE id=?`)
    .run(
      b.name ?? p.name, b.description ?? p.description, b.client_id ?? p.client_id,
      b.employee_id ?? p.employee_id, b.status ?? p.status, b.deadline ?? p.deadline, p.id
    );
  res.json(await db.prepare('SELECT * FROM projects WHERE id = ?').get(p.id));
});

router.delete('/projects/:id', async (req, res) => {
  await db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---- Tasks ----
router.get('/tasks', async (req, res) => {
  const tasks = await db.prepare(`
    SELECT t.*, (SELECT name FROM users WHERE id = t.assigned_to) AS assignee_name,
      (SELECT name FROM projects WHERE id = t.project_id) AS project_name
    FROM tasks t ORDER BY t.created_at DESC
  `).all();
  res.json(tasks);
});

router.post('/tasks', async (req, res) => {
  const { project_id, title, description, assigned_to, status, due_date } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });
  const info = await db
    .prepare('INSERT INTO tasks (project_id, title, description, assigned_to, status, due_date) VALUES (?, ?, ?, ?, ?, ?)')
    .run(project_id || null, title, description || null, assigned_to || null, status || 'todo', due_date || null);
  res.status(201).json(await db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid));
});

router.patch('/tasks/:id', async (req, res) => {
  const t = await db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  const b = req.body || {};
  await db.prepare(`UPDATE tasks SET project_id=?, title=?, description=?, assigned_to=?, status=?, due_date=? WHERE id=?`)
    .run(b.project_id ?? t.project_id, b.title ?? t.title, b.description ?? t.description,
      b.assigned_to ?? t.assigned_to, b.status ?? t.status, b.due_date ?? t.due_date, t.id);
  res.json(await db.prepare('SELECT * FROM tasks WHERE id = ?').get(t.id));
});

router.delete('/tasks/:id', async (req, res) => {
  await db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---- Invoices ----
router.get('/invoices', async (req, res) => {
  const invoices = await db.prepare(`
    SELECT i.*, c.company_name AS client_name,
      (SELECT name FROM projects WHERE id = i.project_id) AS project_name
    FROM invoices i LEFT JOIN clients c ON i.client_id = c.id
    ORDER BY i.issued_date DESC
  `).all();
  res.json(invoices);
});

router.post('/invoices', async (req, res) => {
  const { client_id, project_id, amount, currency, status, issued_date, due_date, notes } = req.body || {};
  if (!client_id || amount === undefined) return res.status(400).json({ error: 'Client and amount required' });
  const info = await db
    .prepare('INSERT INTO invoices (client_id, project_id, amount, currency, status, issued_date, due_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(client_id, project_id || null, amount, currency || 'USD', status || 'pending', issued_date || null, due_date || null, notes || null);
  res.status(201).json(await db.prepare('SELECT * FROM invoices WHERE id = ?').get(info.lastInsertRowid));
});

router.patch('/invoices/:id', async (req, res) => {
  const inv = await db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!inv) return res.status(404).json({ error: 'Invoice not found' });
  const b = req.body || {};
  await db.prepare(`UPDATE invoices SET client_id=?, project_id=?, amount=?, currency=?, status=?, issued_date=?, due_date=?, notes=? WHERE id=?`)
    .run(b.client_id ?? inv.client_id, b.project_id ?? inv.project_id, b.amount ?? inv.amount,
      b.currency ?? inv.currency, b.status ?? inv.status, b.issued_date ?? inv.issued_date,
      b.due_date ?? inv.due_date, b.notes ?? inv.notes, inv.id);
  res.json(await db.prepare('SELECT * FROM invoices WHERE id = ?').get(inv.id));
});

router.delete('/invoices/:id', async (req, res) => {
  await db.prepare('DELETE FROM invoices WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
