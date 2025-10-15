import { Pool } from 'pg';

// Using a connection string from an environment variable
const pool = new Pool({
	connectionString: process.env.DATABASE_URL, // Set DATABASE_URL in Render env vars
});

// Or using individual credentials
// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

async function testConnection() {
	try {
		const client = await pool.connect();
		console.log('Successfully connected to the database!');
		const data = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
		console.log(data);
		client.release();
	} catch (err) {
		console.error('Database connection error:', err);
	}
}

testConnection();
