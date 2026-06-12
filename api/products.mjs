import pool from "./db.mjs";
import { setCorsHeaders } from "./utils.mjs";

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { category, price } = req.query || {};
  const client = await pool.connect();

  try {
    let query = `
      SELECT
        p.id,
        p.name,
        p.price,
        p.description,
        p.category,
        json_agg(pi.img_path) AS images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
    `;

    const conditions = [];
    const params = [];

    if (category && category !== "All") {
      params.push(category.toLowerCase());
      conditions.push(`LOWER(p.category) = $${params.length}`);
    }

    if (price) {
      if (price.includes("-")) {
        const [min, max] = price.split("-").map(Number);
        params.push(min, max);
        conditions.push(
          `p.price BETWEEN $${params.length - 1} AND $${params.length}`,
        );
      } else if (price.endsWith("+")) {
        const min = parseFloat(price.replace("+", ""));
        params.push(min);
        conditions.push(`p.price >= $${params.length}`);
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` GROUP BY p.id ORDER BY p.id ASC;`;

    const result = await client.query(query, params);
    const rows = result.rows.map((row) => ({
      ...row,
      images: Array.isArray(row.images) ? row.images.filter(Boolean) : [],
    }));

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Products API error:", err);
    return res.status(500).json({ message: "Server error." });
  } finally {
    client.release();
  }
}
