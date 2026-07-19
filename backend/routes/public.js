import { Router } from 'express';
import db from '../db.js';
import { authenticate } from '../auth.js';

const router = Router();

router.get('/services', async (req, res) => {
  const services = await db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all();
  res.json(services);
});

router.post('/contacts', async (req, res) => {
  const { name, email, company, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }
  await db.prepare(
    'INSERT INTO contacts (name, email, company, message) VALUES (?, ?, ?, ?)'
  ).run(name, email, company || null, message);
  res.status(201).json({ ok: true });
});

router.get('/contacts', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const contacts = await db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  res.json(contacts);
});

export default router;
