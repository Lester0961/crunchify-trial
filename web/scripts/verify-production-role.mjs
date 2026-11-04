import assert from "node:assert/strict";
import { once } from "node:events";
import { createInterface } from "node:readline";
import pg from "pg";
import { prepareVerifiedConnection } from "../src/server/db/connection.ts";

// Read the connection URI from stdin so it is not placed in shell arguments or logs.
if (process.stdin.isTTY) process.stdin.setRawMode(true);
const inputReader = createInterface({ input: process.stdin, terminal: false });
const [input] = await once(inputReader, "line");
if (process.stdin.isTTY) process.stdin.setRawMode(false);
inputReader.close();
let client;
try {
  client = new pg.Client({ ...prepareVerifiedConnection(input.trim()), connectionTimeoutMillis: 10000 });
  await client.connect();
  const result = await client.query(`SELECT current_user AS role,
    has_schema_privilege(current_user, 'crunchify_private', 'USAGE') AS production_usage,
    has_table_privilege(current_user, 'crunchify_private.inquiries', 'SELECT') AND
    has_table_privilege(current_user, 'crunchify_private.inquiries', 'INSERT') AND
    has_table_privilege(current_user, 'crunchify_private.inquiries', 'UPDATE') AS inquiry_access,
    has_table_privilege(current_user, 'crunchify_private.inquiries', 'DELETE') AS inquiry_delete,
    has_schema_privilege(current_user, 'crunchify_preview', 'USAGE') AS preview_usage`);
  const row = result.rows[0];
  assert.equal(row.role, "crunchify_production_app");
  assert.equal(row.production_usage, true);
  assert.equal(row.inquiry_access, true);
  assert.equal(row.inquiry_delete, false);
  assert.equal(row.preview_usage, false);
  await client.query("SELECT 1 FROM crunchify_private.inquiries LIMIT 0");
  console.log("Production role connected with verified TLS and expected privileges.");
} catch (error) {
  // Error messages can contain connection details; emit only a bounded code.
  const code = typeof error?.code === "string" && /^[A-Z0-9_]{1,64}$/.test(error.code) ? error.code : "VERIFICATION_FAILED";
  console.error(`Production role verification failed: ${code}`);
  process.exitCode = 1;
} finally {
  if (client) await client.end().catch(() => {});
}
