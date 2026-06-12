import pool from "../db.js";
import { getAuthPayload, setCorsHeaders } from "../utils.js";

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const method = req.method;

  try {
    const payload = getAuthPayload(req);
    const client = await pool.connect();
    try {
      if (method === "GET") {
        const result = await client.query(
          `SELECT ci.product_id, ci.quantity, p.name, p.price
           FROM cart_items ci
           LEFT JOIN products p ON p.id = ci.product_id
           WHERE ci.user_id = $1`,
          [payload.id],
        );
        return res.status(200).json({ items: result.rows });
      }

      if (method === "POST") {
        const { productId, quantity } = req.body || {};
        if (!productId || typeof quantity !== "number") {
          return res
            .status(400)
            .json({ message: "productId and quantity required." });
        }

        if (quantity <= 0) {
          await client.query(
            "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
            [payload.id, productId],
          );
          return res.status(200).json({ message: "Item removed from cart." });
        }

        const existing = await client.query(
          "SELECT id FROM cart_items WHERE user_id = $1 AND product_id = $2",
          [payload.id, productId],
        );
        if (existing.rows.length) {
          await client.query(
            "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
            [quantity, payload.id, productId],
          );
        } else {
          await client.query(
            "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)",
            [payload.id, productId, quantity],
          );
        }
        return res.status(200).json({ message: "Cart updated." });
      }

      return res.status(405).json({ message: "Method not allowed." });
    } finally {
      client.release();
    }
  } catch (err) {
    return res
      .status(err.status || 401)
      .json({ message: err.message || "Invalid or expired token." });
  }
}
