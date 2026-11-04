import test from "node:test";
import assert from "node:assert/strict";
import { preparePreviewConnection, selectDatabaseUrl } from "../../src/server/db/connection.ts";

test("uses a separate credential for preview and fails closed if it is absent", () => {
  assert.equal(selectDatabaseUrl({ VERCEL_ENV: "preview", DATABASE_URL: "production", PREVIEW_DATABASE_URL: "preview" }), "preview");
  assert.throws(() => selectDatabaseUrl({ VERCEL_ENV: "preview", DATABASE_URL: "production" }), /Preview database is not configured/);
  assert.equal(selectDatabaseUrl({ VERCEL_ENV: "production", DATABASE_URL: "production", PREVIEW_DATABASE_URL: "preview" }), "production");
  assert.throws(() => selectDatabaseUrl({ VERCEL_ENV: "production" }), /Database is not configured/);
});

test("requires verified TLS for remote preview connections and preserves the trusted CA", () => {
  assert.throws(() => preparePreviewConnection("postgresql://preview:password@example.test/db?sslmode=require"), /verified TLS/);
  const configured = preparePreviewConnection("postgresql://preview:password@example.test/db?sslmode=verify-full");
  assert.equal(new URL(configured.connectionString).searchParams.has("sslmode"), false);
  assert.equal(configured.ssl.rejectUnauthorized, true);
  assert.match(configured.ssl.ca, /BEGIN CERTIFICATE/);
  assert.equal(preparePreviewConnection("postgresql://preview@127.0.0.1/test").ssl, undefined);
});
