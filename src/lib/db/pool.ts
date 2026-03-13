import { Pool } from "pg";

// Use DIRECT_DATABASE_URL for the raw pg driver.
// This requires `prisma dev` to be running (it starts the embedded postgres on port 51214).
const pool = new Pool({
  connectionString: process.env.DIRECT_DATABASE_URL,
});

export default pool;
