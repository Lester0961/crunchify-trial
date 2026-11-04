import test from "node:test";
import assert from "node:assert/strict";
import { prepareVerifiedConnection, selectDatabaseUrl } from "../../src/server/db/connection.ts";

test("uses a separate credential for preview and fails closed if it is absent", () => {
  assert.equal(selectDatabaseUrl({ VERCEL_ENV: "preview", DATABASE_URL: "production", PREVIEW_DATABASE_URL: "preview" }), "preview");
  assert.throws(() => selectDatabaseUrl({ VERCEL_ENV: "preview", DATABASE_URL: "production" }), /Preview database is not configured/);
  assert.equal(selectDatabaseUrl({ VERCEL_ENV: "production", DATABASE_URL: "old", PRODUCTION_DATABASE_URL: "production" }), "production");
  assert.throws(() => selectDatabaseUrl({ VERCEL_ENV: "production", DATABASE_URL: "old" }), /Production database is not configured/);
  assert.equal(selectDatabaseUrl({ DATABASE_URL: "local" }), "local");
});

test("requires verified TLS for remote preview connections and preserves the trusted CA", () => {
  assert.throws(() => prepareVerifiedConnection("postgresql://preview:password@example.test/db?sslmode=require"), /verified TLS/);
  const configured = prepareVerifiedConnection("postgresql://preview:password@example.test/db?sslmode=verify-full");
  assert.equal(new URL(configured.connectionString).searchParams.has("sslmode"), false);
  assert.equal(configured.ssl.rejectUnauthorized, true);
  assert.match(configured.ssl.ca, /BEGIN CERTIFICATE/);
  assert.equal(prepareVerifiedConnection("postgresql://preview@127.0.0.1/test").ssl, undefined);
});
