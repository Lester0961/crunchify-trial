import "server-only";
import { Pool } from "pg";
import { selectDatabaseSchema } from "./schema";
import { selectDatabaseUrl } from "./connection";
let pool: Pool | undefined;
export function databaseSchema() {
  return selectDatabaseSchema({ DATABASE_SCHEMA: process.env.DATABASE_SCHEMA, VERCEL_ENV: process.env.VERCEL_ENV });
}
export function database() {
  const connectionString = selectDatabaseUrl({ VERCEL_ENV: process.env.VERCEL_ENV, DATABASE_URL: process.env.DATABASE_URL, PREVIEW_DATABASE_URL: process.env.PREVIEW_DATABASE_URL });
  pool ??= new Pool({ connectionString, max: 3, connectionTimeoutMillis: 5000 });
  return pool;
}
