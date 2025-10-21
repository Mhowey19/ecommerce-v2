import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

// Helper for dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// API route for products with category + price filtering
app.get('/products/api', async (req, res) => {
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
		if (category && category !== 'All') {
			params.push(category.toLowerCase());
			conditions.push(`LOWER(p.category) = $${params.length}`);
		}

		//price filter
		if (price) {
			if (price.includes('-')) {
				const [min, max] = price.split('-').map(Number);
				params.push(min, max);
				conditions.push(`p.price BETWEEN $${params.length - 1} AND $${params.length}`);
			} else if (price.endsWith('+')) {
				const min = parseFloat(price.replace('+', ''));
				params.push(min);
				conditions.push(`p.price >= $${params.length}`);
			}
		}

		// Combine filters
		if (conditions.length > 0) {
			query += ` WHERE ${conditions.join(' AND ')}`;
		}

		query += ` GROUP BY p.id ORDER BY p.id ASC;`;

		const result = await client.query(query, params);
		res.json(result.rows);
		client.release();
	} catch (err) {
		console.error('Server error:', err);
		res.status(500).send('Server error');
	}
});

// Catch-all route for React Router
app.use((req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
