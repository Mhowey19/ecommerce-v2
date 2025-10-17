import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

// Enable CORS for all routes
app.use(cors());
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false, // required for Render hosting
	},
});

app.get('/products/api', async (req, res) => {
	try {
		const client = await pool.connect();
		const result = await client.query(`
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
		client.release();
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
