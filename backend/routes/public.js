import { Router } from 'express';
import db from '../db.js';
import { authenticate } from '../auth.js';

const router = Router();

router.get('/services', (req, res) => {
  const services = db
    .prepare('SELECT * FROM services ORDER BY sort_order ASC')
    .all();
  res.json(services);
});

router.post('/contacts', (req, res) => {
  const { name, email, company, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }
  db.prepare(
    'INSERT INTO contacts (name, email, company, message) VALUES (?, ?, ?, ?)'
  ).run(name, email, company || null, message);
  res.status(201).json({ ok: true });
});

router.get('/contacts', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  res.json(contacts);
});

export default router;
