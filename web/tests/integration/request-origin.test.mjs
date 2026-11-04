import test from "node:test";
import assert from "node:assert/strict";
import { sameOriginUrl } from "../../src/server/security/request-origin.ts";

function request(headers) {
  return new Request("http://0.0.0.0:3000/api/admin/login", { method: "POST", headers });
}

test("accepts the browser host rather than the standalone server bind address", () => {
  assert.equal(sameOriginUrl(request({ host: "localhost:3000", origin: "http://localhost:3000" }))?.origin, "http://localhost:3000");
});

test("uses an overwritten HTTPS proxy scheme for the public origin", () => {
  assert.equal(sameOriginUrl(request({ host: "crunchify.example", origin: "https://crunchify.example", "x-forwarded-proto": "https" }))?.origin, "https://crunchify.example");
});

test("rejects cross-origin, missing, malformed, or ambiguous headers", () => {
  for (const headers of [
    { host: "crunchify.example", origin: "https://attacker.example", "x-forwarded-proto": "https" },
    { host: "crunchify.example", origin: "http://crunchify.example", "x-forwarded-proto": "https" },
    { host: "crunchify.example", origin: "https://crunchify.example", "x-forwarded-proto": "https,http" },
    { host: "crunchify.example/attacker", origin: "https://crunchify.example", "x-forwarded-proto": "https" },
    { host: "crunchify.example", "x-forwarded-proto": "https" },
  ]) assert.equal(sameOriginUrl(request(headers)), null);
});
