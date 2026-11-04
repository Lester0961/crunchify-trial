import test from "node:test";
import assert from "node:assert/strict";
import { selectDatabaseUrl } from "../../src/server/db/connection.ts";

test("uses a separate credential for preview and fails closed if it is absent", () => {
  assert.equal(selectDatabaseUrl({ VERCEL_ENV: "preview", DATABASE_URL: "production", PREVIEW_DATABASE_URL: "preview" }), "preview");
  assert.throws(() => selectDatabaseUrl({ VERCEL_ENV: "preview", DATABASE_URL: "production" }), /Preview database is not configured/);
  assert.equal(selectDatabaseUrl({ VERCEL_ENV: "production", DATABASE_URL: "production", PREVIEW_DATABASE_URL: "preview" }), "production");
  assert.throws(() => selectDatabaseUrl({ VERCEL_ENV: "production" }), /Database is not configured/);
});
