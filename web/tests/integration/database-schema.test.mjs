import test from "node:test";
import assert from "node:assert/strict";
import { selectDatabaseSchema } from "../../src/server/db/schema.ts";

test("routes preview to its own schema and keeps production on the original schema", () => {
  assert.equal(selectDatabaseSchema({ VERCEL_ENV: "preview" }), "crunchify_preview");
  assert.equal(selectDatabaseSchema({ VERCEL_ENV: "production" }), "crunchify_private");
  assert.equal(selectDatabaseSchema({}), "crunchify_private");
  assert.equal(selectDatabaseSchema({ DATABASE_SCHEMA: "crunchify_preview" }), "crunchify_preview");
});

test("rejects arbitrary SQL identifiers", () => {
  assert.throws(() => selectDatabaseSchema({ DATABASE_SCHEMA: "crunchify_private; DROP SCHEMA public" }), /Invalid database schema/);
  assert.throws(() => selectDatabaseSchema({ VERCEL_ENV: "preview", DATABASE_SCHEMA: "crunchify_private" }), /Preview must use/);
  assert.throws(() => selectDatabaseSchema({ VERCEL_ENV: "production", DATABASE_SCHEMA: "crunchify_preview" }), /Production must use/);
});
