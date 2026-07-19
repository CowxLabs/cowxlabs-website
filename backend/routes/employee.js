import { Router } from 'express';
import db from '../db.js';
import { authenticate, requireRole } from '../auth.js';

const router = Router();
router.use(authenticate, requireRole('employee', 'admin'));

router.get('/dashboard', (req, res) => {
  const myId = req.user.id;
  const projects = db.prepare(`
    SELECT p.*, c.company_name AS client_name
    FROM projects p LEFT JOIN clients c ON p.client_id = c.id
    WHERE p.employee_id = ? ORDER BY p.created_at DESC
  `).all(myId);
  const tasks = db.prepare(`
    SELECT t.*, (SELECT name FROM projects WHERE id = t.project_id) AS project_name
    FROM tasks t WHERE t.assigned_to = ? ORDER BY t.due_date ASC
  `).all(myId);
  const stats = {
    projects: projects.length,
    activeProjects: projects.filter((p) => p.status === 'in_progress').length,
    tasks: tasks.length,
    openTasks: tasks.filter((t) => t.status !== 'done').length
  };
  res.json({ projects, tasks, stats });
});

router.patch('/tasks/:id/status', (req, res) => {
  const { status } = req.body || {};
  const t = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  if (t.assigned_to !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not assigned to you' });
  }
  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, t.id);
  res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(t.id));
});

export default router;
