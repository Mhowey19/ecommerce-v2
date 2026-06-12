import pool from "./db.js";
import { getAuthPayload } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const payload = getAuthPayload(req);
    return res
      .status(200)
      .json({ user: { id: payload.id, email: payload.email } });
  } catch (err) {
    return res
      .status(err.status || 401)
      .json({ message: err.message || "Invalid or expired token." });
  }
}
