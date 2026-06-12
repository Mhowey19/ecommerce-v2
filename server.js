import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "please_change_this_secret";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// PostgreSQL connection
const connectionString =
  process.env.DATABASE_URL ||
  process.env.RAILWAY_DATABASE_URL ||
  process.env.PG_URI ||
  process.env.PG_URL;

if (!connectionString) {
  console.error(
    "❌ Missing database connection string. Set DATABASE_URL or RAILWAY_DATABASE_URL.",
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function initializeDb() {
  const client = await pool.connect();
  try {
    await client.query(`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				email TEXT UNIQUE NOT NULL,
				password TEXT NOT NULL,
				created_at TIMESTAMP DEFAULT NOW()
			);

			CREATE TABLE IF NOT EXISTS cart_items (
				id SERIAL PRIMARY KEY,
				user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
				product_id INTEGER NOT NULL,
				quantity INTEGER NOT NULL DEFAULT 1,
				added_at TIMESTAMP DEFAULT NOW(),
				UNIQUE(user_id, product_id)
			);
		`);
    console.log("✅ Auth table ready");
  } catch (err) {
    console.error("❌ DB initialize error:", err);
  } finally {
    client.release();
  }
}

initializeDb();

// Helper for dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "dist")));

// API route for products with category + price filtering
app.get("/products/api", async (req, res) => {
  try {
    const client = await pool.connect();
    const { category, price } = req.query;

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

    // Category filter
    if (category && category !== "All") {
      params.push(category.toLowerCase());
      conditions.push(`LOWER(p.category) = $${params.length}`);
    }

    //price filter
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

    // Combine filters
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` GROUP BY p.id ORDER BY p.id ASC;`;

    const result = await client.query(query, params);
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const client = await pool.connect();
  try {
    const existing = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()],
    );
    if (existing.rows.length) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await client.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email.toLowerCase(), passwordHash],
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token, user });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error during signup." });
  } finally {
    client.release();
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id, email, password FROM users WHERE email = $1",
      [email.toLowerCase()],
    );
    if (!result.rows.length) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  } finally {
    client.release();
  }
});

app.get("/api/profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing bearer token." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ user: { id: payload.id, email: payload.email } });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

app.use(express.static("public"));

app.post("/api/update-email", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing bearer token." });
  }

  const token = authHeader.split(" ")[1];
  const { email } = req.body;
  if (!email || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
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
      const newToken = jwt.sign(
        { id: payload.id, email: email.toLowerCase() },
        JWT_SECRET,
        { expiresIn: "1h" },
      );
      return res.json({
        token: newToken,
        user: { id: payload.id, email: email.toLowerCase() },
      });
    } finally {
      client.release();
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

app.post("/api/update-password", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing bearer token." });
  }

  const token = authHeader.split(" ")[1];
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({
      message:
        "Current password and a new password of at least 6 characters are required.",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT password FROM users WHERE id = $1",
        [payload.id],
      );
      if (!result.rows.length) {
        return res.status(404).json({ message: "User not found." });
      }

      const validPassword = await bcrypt.compare(
        currentPassword,
        result.rows[0].password,
      );
      if (!validPassword) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect." });
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await client.query("UPDATE users SET password = $1 WHERE id = $2", [
        newHash,
        payload.id,
      ]);
      return res.json({ message: "Password updated successfully." });
    } finally {
      client.release();
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

// Cart endpoints (per-user)
app.get("/api/cart", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing bearer token." });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT ci.product_id, ci.quantity, p.name, p.price
				 FROM cart_items ci
				 LEFT JOIN products p ON p.id = ci.product_id
				 WHERE ci.user_id = $1`,
        [payload.id],
      );
      return res.json({ items: result.rows });
    } finally {
      client.release();
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

app.post("/api/cart", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing bearer token." });
  const token = authHeader.split(" ")[1];
  const { productId, quantity } = req.body;
  if (!productId || typeof quantity !== "number")
    return res
      .status(400)
      .json({ message: "productId and quantity required." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    try {
      if (quantity <= 0) {
        await client.query(
          "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
          [payload.id, productId],
        );
        return res.json({ message: "Item removed from cart." });
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
      return res.json({ message: "Cart updated." });
    } finally {
      client.release();
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

app.delete("/api/cart/:productId", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing bearer token." });
  const token = authHeader.split(" ")[1];
  const productId = parseInt(req.params.productId, 10);
  if (!productId)
    return res.status(400).json({ message: "Invalid product id." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    try {
      await client.query(
        "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
        [payload.id, productId],
      );
      return res.json({ message: "Item removed." });
    } finally {
      client.release();
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

// Catch-all route for React Router
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running on port ${PORT}`),
);
