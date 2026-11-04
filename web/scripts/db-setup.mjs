import { readFile } from "node:fs/promises";
import pg from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  for (const file of ["database/migrations/001_inquiries.sql", "database/seed/001_products.sql"]) {
    await client.query(await readFile(new URL(`../${file}`, import.meta.url), "utf8"));
    console.log(`Applied ${file}`);
  }
} finally {
  await client.end();
}
