import { Pool } from 'pg';

import dotenv from 'dotenv';
dotenv.config();
// Create connection pool using Render's connection string
const pool = new Pool({
	connectionString:
		'postgresql://root:1qyYFIopWaZB9CnC6tdYxaZV78PXgs19@dpg-d3n9ts3ipnbc73elblsg-a.oregon-postgres.render.com/ecommerce_7yed',
	ssl: { rejectUnauthorized: false },
});

async function dbConnection() {
	let client;
	try {
		client = await pool.connect();
		console.log('✅ Connected to Render DB');

		const result = await client.query(`SELECT category FROM products
`);
		console.log('Sample result:', result.rows);
	} catch (err) {
		console.error('❌ Error: ', err);
	} finally {
		if (client) client.release();
	}
}

dbConnection();
