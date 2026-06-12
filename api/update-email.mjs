import pool from "./db.mjs";
import { getAuthPayload, emailRegex, setCorsHeaders } from "./utils.mjs";

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { email } = req.body || {};
  if (!email || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  try {
    const payload = getAuthPayload(req);
    const client = await pool.connect();
    try {
      const existing = await client.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email.toLowerCase(), payload.id],
      );
      if (existing.rows.length) {
        return res.status(409).json({ message: "Email already in use." });
      }
      await client.query("UPDATE users SET email = $1 WHERE id = $2", [
        email.toLowerCase(),
        payload.id,
      ]);
      return res.status(200).json({
        token: null,
        user: { id: payload.id, email: email.toLowerCase() },
      });
    } finally {
      client.release();
    }
  } catch (err) {
    return res
      .status(err.status || 401)
      .json({ message: err.message || "Invalid or expired token." });
  }
}
