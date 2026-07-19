import { Router } from 'express';
import db from '../db.js';
import { authenticate, requireRole } from '../auth.js';

const router = Router();
router.use(authenticate, requireRole('client'));

router.get('/dashboard', (req, res) => {
  const client = db.prepare('SELECT * FROM clients WHERE user_id = ?').get(req.user.id);
  if (!client) return res.status(404).json({ error: 'Client profile not found' });
  const projects = db.prepare(`
    SELECT p.*, (SELECT name FROM users WHERE id = p.employee_id) AS employee_name
    FROM projects p WHERE p.client_id = ? ORDER BY p.created_at DESC
  `).all(client.id);
  const invoices = db.prepare(`
    SELECT * FROM invoices WHERE client_id = ? ORDER BY issued_date DESC
  `).all(client.id);
  const outstanding = db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM invoices WHERE client_id = ? AND status = 'pending'").get(client.id).s;
  const stats = {
    projects: projects.length,
    activeProjects: projects.filter((p) => p.status === 'in_progress').length,
    invoices: invoices.length,
    outstanding
  };
  res.json({ client, projects, invoices, stats });
});

router.get('/projects/:id', (req, res) => {
  const client = db.prepare('SELECT * FROM clients WHERE user_id = ?').get(req.user.id);
  const project = db.prepare('SELECT * FROM projects WHERE id = ? AND client_id = ?').get(req.params.id, client?.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const tasks = db.prepare('SELECT * FROM tasks WHERE project_id = ? ORDER BY due_date ASC').all(project.id);
  res.json({ project, tasks });
});

export default router;
