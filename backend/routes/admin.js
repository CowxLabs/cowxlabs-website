import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { authenticate, requireRole, getUserById } from '../auth.js';

const router = Router();
router.use(authenticate, requireRole('admin'));

router.get('/stats', (req, res) => {
  const stats = {
    users: db.prepare("SELECT COUNT(*) AS c FROM users WHERE role != 'admin'").get().c,
    employees: db.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'employee'").get().c,
    clients: db.prepare('SELECT COUNT(*) AS c FROM clients').get().c,
    projects: db.prepare('SELECT COUNT(*) AS c FROM projects').get().c,
    activeProjects: db.prepare("SELECT COUNT(*) AS c FROM projects WHERE status = 'in_progress'").get().c,
    invoicesOutstanding: db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM invoices WHERE status = 'pending'").get().s,
    openTasks: db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE status != 'done'").get().c
  };
  res.json(stats);
});

// ---- Users ----
router.get('/users', (req, res) => {
  const users = db
    .prepare('SELECT id, name, email, role, active, created_at FROM users ORDER BY created_at DESC')
    .all();
  res.json(users);
});

router.post('/users', (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields required' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email exists' });
  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, ?, 1)')
    .run(name, email, hash, role);
  res.status(201).json(getUserById(info.lastInsertRowid));
});

router.patch('/users/:id', (req, res) => {
  const { name, email, role, active, password } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
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
  db.prepare(sql).run(...params);
  res.json(getUserById(user.id));
});

router.delete('/users/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ? AND role != ?').run(req.params.id, 'admin');
  res.json({ ok: true });
});

// ---- Clients ----
router.get('/clients', (req, res) => {
  const clients = db.prepare('SELECT * FROM clients ORDER BY company_name').all();
  res.json(clients);
});

router.post('/clients', (req, res) => {
  const { company_name, contact_name, email, phone, notes, user_id } = req.body || {};
  if (!company_name) return res.status(400).json({ error: 'Company name required' });
  const info = db
    .prepare('INSERT INTO clients (user_id, company_name, contact_name, email, phone, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run(user_id || null, company_name, contact_name || null, email || null, phone || null, notes || null);
  res.status(201).json(db.prepare('SELECT * FROM clients WHERE id = ?').get(info.lastInsertRowid));
});

router.patch('/clients/:id', (req, res) => {
  const c = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Client not found' });
  const b = req.body || {};
  db.prepare(`UPDATE clients SET company_name=?, contact_name=?, email=?, phone=?, notes=? WHERE id=?`)
    .run(
      b.company_name ?? c.company_name,
      b.contact_name ?? c.contact_name,
      b.email ?? c.email,
      b.phone ?? c.phone,
      b.notes ?? c.notes,
      c.id
    );
  res.json(db.prepare('SELECT * FROM clients WHERE id = ?').get(c.id));
});

router.delete('/clients/:id', (req, res) => {
  db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---- Projects ----
router.get('/projects', (req, res) => {
  const projects = db.prepare(`
    SELECT p.*, c.company_name AS client_name,
      (SELECT name FROM users WHERE id = p.employee_id) AS employee_name
    FROM projects p LEFT JOIN clients c ON p.client_id = c.id
    ORDER BY p.created_at DESC
  `).all();
  res.json(projects);
});

router.post('/projects', (req, res) => {
  const { name, description, client_id, employee_id, status, deadline } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Name required' });
  const info = db
    .prepare('INSERT INTO projects (name, description, client_id, employee_id, status, deadline) VALUES (?, ?, ?, ?, ?, ?)')
    .run(name, description || null, client_id || null, employee_id || null, status || 'planning', deadline || null);
  res.status(201).json(db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid));
});

router.patch('/projects/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  const b = req.body || {};
  db.prepare(`UPDATE projects SET name=?, description=?, client_id=?, employee_id=?, status=?, deadline=? WHERE id=?`)
    .run(
      b.name ?? p.name, b.description ?? p.description, b.client_id ?? p.client_id,
      b.employee_id ?? p.employee_id, b.status ?? p.status, b.deadline ?? p.deadline, p.id
    );
  res.json(db.prepare('SELECT * FROM projects WHERE id = ?').get(p.id));
});

router.delete('/projects/:id', (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---- Tasks ----
router.get('/tasks', (req, res) => {
  const tasks = db.prepare(`
    SELECT t.*, (SELECT name FROM users WHERE id = t.assigned_to) AS assignee_name,
      (SELECT name FROM projects WHERE id = t.project_id) AS project_name
    FROM tasks t ORDER BY t.created_at DESC
  `).all();
  res.json(tasks);
});

router.post('/tasks', (req, res) => {
  const { project_id, title, description, assigned_to, status, due_date } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });
  const info = db
    .prepare('INSERT INTO tasks (project_id, title, description, assigned_to, status, due_date) VALUES (?, ?, ?, ?, ?, ?)')
    .run(project_id || null, title, description || null, assigned_to || null, status || 'todo', due_date || null);
  res.status(201).json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid));
});

router.patch('/tasks/:id', (req, res) => {
  const t = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  const b = req.body || {};
  db.prepare(`UPDATE tasks SET project_id=?, title=?, description=?, assigned_to=?, status=?, due_date=? WHERE id=?`)
    .run(b.project_id ?? t.project_id, b.title ?? t.title, b.description ?? t.description,
      b.assigned_to ?? t.assigned_to, b.status ?? t.status, b.due_date ?? t.due_date, t.id);
  res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(t.id));
});

router.delete('/tasks/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---- Invoices ----
router.get('/invoices', (req, res) => {
  const invoices = db.prepare(`
    SELECT i.*, c.company_name AS client_name,
      (SELECT name FROM projects WHERE id = i.project_id) AS project_name
    FROM invoices i LEFT JOIN clients c ON i.client_id = c.id
    ORDER BY i.issued_date DESC
  `).all();
  res.json(invoices);
});

router.post('/invoices', (req, res) => {
  const { client_id, project_id, amount, currency, status, issued_date, due_date, notes } = req.body || {};
  if (!client_id || amount === undefined) return res.status(400).json({ error: 'Client and amount required' });
  const info = db
    .prepare('INSERT INTO invoices (client_id, project_id, amount, currency, status, issued_date, due_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(client_id, project_id || null, amount, currency || 'USD', status || 'pending', issued_date || null, due_date || null, notes || null);
  res.status(201).json(db.prepare('SELECT * FROM invoices WHERE id = ?').get(info.lastInsertRowid));
});

router.patch('/invoices/:id', (req, res) => {
  const inv = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!inv) return res.status(404).json({ error: 'Invoice not found' });
  const b = req.body || {};
  db.prepare(`UPDATE invoices SET client_id=?, project_id=?, amount=?, currency=?, status=?, issued_date=?, due_date=?, notes=? WHERE id=?`)
    .run(b.client_id ?? inv.client_id, b.project_id ?? inv.project_id, b.amount ?? inv.amount,
      b.currency ?? inv.currency, b.status ?? inv.status, b.issued_date ?? inv.issued_date,
      b.due_date ?? inv.due_date, b.notes ?? inv.notes, inv.id);
  res.json(db.prepare('SELECT * FROM invoices WHERE id = ?').get(inv.id));
});

router.delete('/invoices/:id', (req, res) => {
  db.prepare('DELETE FROM invoices WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
