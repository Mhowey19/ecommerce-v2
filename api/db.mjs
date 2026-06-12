import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const ssl = connectionString ? { rejectUnauthorized: false } : undefined;

if (!globalThis.__pgPool) {
  globalThis.__pgPool = new Pool({ connectionString, ssl });
}

export default globalThis.__pgPool;
