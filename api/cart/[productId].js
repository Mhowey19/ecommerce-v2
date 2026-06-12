import pool from "../db.js";
import { getAuthPayload } from "../utils.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const payload = getAuthPayload(req);
    const { productId } = req.query || {};
    const id = parseInt(productId, 10);
    if (!id) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const client = await pool.connect();
    try {
      await client.query(
        "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
        [payload.id, id],
      );
      return res.status(200).json({ message: "Item removed." });
    } finally {
      client.release();
    }
  } catch (err) {
    return res
      .status(err.status || 401)
      .json({ message: err.message || "Invalid or expired token." });
  }
}
