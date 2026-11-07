import test from "node:test";
import assert from "node:assert/strict";
import { deliverBrevo } from "../../src/server/email/brevo.ts";

const input = { apiKey: "test-key", from: "sender@example.invalid", to: "recipient@example.invalid", subject: "Test", text: "Test message", html: "<p>Test message</p>", key: "inquiry/sender" };

test("sends a provider request with the intended sender and recipient and a stable idempotency key", async () => {
  const calls = [];
  const request = async (url, options) => { calls.push({ url, options }); return new Response(null, { status: 201 }); };
  assert.equal(await deliverBrevo(input, request), true);
  assert.equal(await deliverBrevo(input, request), true);
  const first = JSON.parse(calls[0].options.body);
  const second = JSON.parse(calls[1].options.body);
  assert.equal(calls[0].url, "https://api.brevo.com/v3/smtp/email");
  assert.equal(first.sender.email, input.from);
  assert.equal(first.to[0].email, input.to);
  assert.equal(first.htmlContent, input.html);
  assert.equal(first.textContent, input.text);
  assert.equal(first.headers.idempotencyKey, second.headers.idempotencyKey);
  assert.notEqual(first.headers.idempotencyKey, "");
});

test("reports rejected and interrupted provider requests as failures", async () => {
  assert.equal(await deliverBrevo(input, async () => new Response(null, { status: 400 })), false);
  assert.equal(await deliverBrevo(input, async () => { throw new Error("network"); }), false);
});
