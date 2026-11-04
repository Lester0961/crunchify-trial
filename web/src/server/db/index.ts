import "server-only";
import { Pool } from "pg";
let pool: Pool | undefined;
export function database() {
  if (!process.env.DATABASE_URL) throw new Error("Database is not configured");
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 3, connectionTimeoutMillis: 5000 });
  return pool;
}
