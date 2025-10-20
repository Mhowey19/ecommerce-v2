import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Postgres connection
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false, // required for Render hosting
	},
});

// Helper for dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use('/image', express.static(path.join(__dirname, 'public/image')));

// ✅ Serve static files from the React build
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ API route for products (with optional category filter)
app.get('/products/api', async (req, res) => {
	try {
		const client = await pool.connect();
		const { category } = req.query;

		console.log('🔎 Category received from frontend:', category); // <-- add this

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

		const params = [];
		if (category && category.toLowerCase() !== 'all') {
			query += ` WHERE LOWER(p.category) = LOWER($1)`;
			params.push(category);
		}

		query += ` GROUP BY p.id ORDER BY p.id ASC;`;
		const result = await client.query(query, params);
		res.json(result.rows);
		client.release();
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

// ✅ Catch-all route — handles React Router routes
app.use((req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
