import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken, authenticate, requireRole, getUserById } from '../auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role = 'client' } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (!['admin', 'employee', 'client'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hash = bcrypt.hashSync(password, 10);
  const info = await db
    .prepare('INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, ?, 1)')
    .run(name, email, hash, role);
  const user = await getUserById(info.lastInsertRowid);
  res.status(201).json({ token: signToken(user), user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (!user.active) return res.status(403).json({ error: 'Account is disabled' });

  res.json({ token: signToken(user), user: await getUserById(user.id) });
});

router.get('/me', authenticate, async (req, res) => {
  const user = await getUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  let client = null;
  if (user.role === 'client') {
    client = await db.prepare('SELECT * FROM clients WHERE user_id = ?').get(user.id);
  }
  res.json({ user, client });
});

export default router;
