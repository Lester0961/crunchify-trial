import "server-only";
import { Pool } from "pg";
import { selectDatabaseSchema } from "./schema";
let pool: Pool | undefined;
export function databaseSchema() {
  return selectDatabaseSchema({ DATABASE_SCHEMA: process.env.DATABASE_SCHEMA, VERCEL_ENV: process.env.VERCEL_ENV });
}
export function database() {
  if (!process.env.DATABASE_URL) throw new Error("Database is not configured");
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 3, connectionTimeoutMillis: 5000 });
  return pool;
}
