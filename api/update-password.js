import pool from './db.js';
import bcrypt from 'bcryptjs';
import { getAuthPayload } from './utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({
      message: 'Current password and a new password of at least 6 characters are required.',
    });
  }

  try {
    const payload = getAuthPayload(req);
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT password FROM users WHERE id = $1', [payload.id]);
      if (!result.rows.length) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const validPassword = await bcrypt.compare(currentPassword, result.rows[0].password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await client.query('UPDATE users SET password = $1 WHERE id = $2', [newHash, payload.id]);
      return res.status(200).json({ message: 'Password updated successfully.' });
    } finally {
      client.release();
    }
  } catch (err) {
    return res.status(err.status || 401).json({ message: err.message || 'Invalid or expired token.' });
  }
}
