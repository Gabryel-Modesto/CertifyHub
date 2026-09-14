import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({
  path: "./backend/.env",
});

console.log("HOST:", process.env.DB_HOST);
console.log("USER:", process.env.DB_USER);
console.log("PASSWORD EXISTE:", !!process.env.DB_PASSWORD);
console.log("DATABASE:", process.env.DB_NAME);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function connect() {
  const client = await pool.connect();

  return client;
}

export { connect };
