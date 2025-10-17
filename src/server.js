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
	let client;
	try {
		//connect to db
		client = await pool.connect();
		console.log('working db');
		//query for product card information

		const results = await client.query('SELECT * FROM products');
		const productCardData = results.rows;
		res.send({ productCardData }); //Sends data to the react front end
		client.release();
	} catch (err) {
		console.log(`Error ${err}`);
		res.status(500).json({ error: 'Database connection failed' });
	}
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
