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
app.use('/image', express.static(path.join(__dirname, 'public/image')));

// ✅ Serve static files from the React build
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ API route for fetching products
app.get('/products/api', async (req, res) => {
	try {
		const result = await pool.query(`
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        p.description, 
        json_agg(pi.img_path) AS images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id;
    `);
		res.json(result.rows);
	} catch (err) {
		console.error('❌ Database error:', err);
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
