import { Pool } from 'pg';

// Create connection pool using Render's connection string
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

async function dbConnection() {
	let client;
	try {
		client = await pool.connect();
		console.log('Connected to Render DB');
		// const data = await client.query('SELECT * FROM products');
		// console.log(data);

		const query = ` SELECT * FROM product_images
		`;
		const result = await client.query(query);
		console.log('Sample inserted product:', result.rows);
	} catch (err) {
		console.error('Error: ', err);
	} finally {
		if (client) client.release(); // release the client back to the pool
	}
}

dbConnection();
