import assert from "node:assert/strict";
import { createHash, createHmac, randomUUID } from "node:crypto";
import { chromium } from "playwright-core";
import pg from "pg";

// This test writes records and intentionally disables email. Refuse non-local targets.
const base = new URL(process.env.TEST_BASE_URL || "http://localhost:3127");
const databaseUrl = new URL(process.env.TEST_DATABASE_URL || "postgresql://crunchify_test@127.0.0.1:59255/source_test");
const local = (hostname) => ["127.0.0.1", "localhost", "::1", "[::1]"].includes(hostname);
assert.ok(local(base.hostname) && local(databaseUrl.hostname), "Recovery test requires an isolated local app and database");
const db = new pg.Client({ connectionString: databaseUrl.toString() });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const company = `Synthetic recovery ${randomUUID()}`;
const partnerCompany = `Synthetic partner ${randomUUID()}`;
const rateIp = `test-${randomUUID()}`;
const rateKey = createHash("sha256").update(rateIp).digest("hex");
const browserIp = `test-${randomUUID()}`;
const browserKey = createHash("sha256").update(browserIp).digest("hex");
let id;
try {
  await db.connect();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.setExtraHTTPHeaders({ "x-real-ip": browserIp });
  await page.goto(`${base.origin}/?utm_source=recovery-test`);
  await page.getByRole("link", { name: "Become a Wholesale Partner" }).first().click();
  for (const [name, value] of Object.entries({ company, contact: "Test person", email: "test@example.invalid", phone: "1234567", territory: "Test", volume: "100", message: "Isolated recovery test" })) {
    await page.locator(`[name="${name}"]`).fill(value);
  }
  await page.locator('[name="businessType"]').selectOption("Retailer");
  await page.locator('[value="banana-crunch"]').check();
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await page.getByText("Your inquiry has been saved.").waitFor();
  await page.getByText(/couldn’t send all email notifications/).waitFor();
  const saved = await db.query("SELECT id, details, sender_email_status, company_email_status FROM crunchify_private.inquiries WHERE details->>'company'=$1", [company]);
  assert.equal(saved.rowCount, 1);
  ({ id } = saved.rows[0]);
  assert.equal(saved.rows[0].details.utm.utm_source, "recovery-test");
  assert.deepEqual(saved.rows[0].details.products, ["banana-crunch"]);
  assert.equal(saved.rows[0].sender_email_status, "failed");
  assert.equal(saved.rows[0].company_email_status, "failed");
  const honeypot = await page.request.post(`${base.origin}/api/inquiries`, { data: { ...saved.rows[0].details, submissionId: randomUUID(), website: "spam" } });
  assert.equal(honeypot.status(), 400);
  for (let attempt = 1; attempt <= 11; attempt++) {
    const response = await page.request.post(`${base.origin}/api/inquiries`, { headers: { "x-real-ip": rateIp }, data: saved.rows[0].details });
    assert.equal(response.status(), attempt <= 10 ? 200 : 429, `rate limit at attempt ${attempt}`);
  }
  const conflict = await page.request.post(`${base.origin}/api/inquiries`, { data: { ...saved.rows[0].details, message: "Different details" } });
  assert.equal(conflict.status(), 409);
  await page.goto(`${base.origin}/partners`);
  for (const [name, value] of Object.entries({ company: partnerCompany, contact: "Test person", email: "test@example.invalid", businessType: "Media", message: "Isolated partner test" })) {
    await page.locator(`[name="${name}"]`).fill(value);
  }
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await page.getByText("Your inquiry has been saved.").waitFor();
  const partner = await db.query("SELECT kind, details FROM crunchify_private.inquiries WHERE details->>'company'=$1", [partnerCompany]);
  assert.equal(partner.rowCount, 1);
  assert.equal(partner.rows[0].kind, "partner");
  assert.equal(partner.rows[0].details.businessType, "Media");
  assert.equal(partner.rows[0].details.utm.utm_source, "recovery-test");
  const expired = String(Date.now() - 1000);
  const signature = createHmac("sha256", "isolated-test-only-secret-0123456789abcdef").update(expired).digest("hex");
  const expiredContext = await browser.newContext();
  await expiredContext.addCookies([{ name: "crunchify_admin", value: `${expired}.${signature}`, url: base.origin }]);
  const expiredPage = await expiredContext.newPage();
  const expiredAdmin = await expiredPage.request.get(`${base.origin}/admin`, { maxRedirects: 0 });
  assert.equal(expiredAdmin.status(), 307);
  const expiredWrite = await expiredPage.request.post(`${base.origin}/api/admin/inquiries/${id}`, { headers: { origin: base.origin }, form: { status: "closed", note: "Invalid" } });
  assert.equal(expiredWrite.status(), 403);
  await expiredContext.close();
  await page.goto(`${base.origin}/admin/login`);
  await page.locator('[name="username"]').fill("localtest");
  await page.locator('[name="password"]').fill("localtestpassword");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/admin");
  await page.goto(`${base.origin}/admin/inquiries/${id}`);
  await page.getByRole("button", { name: "Retry pending emails" }).click();
  await page.getByText("Sender email: failed · Company email: failed").waitFor();
  await page.locator('[name="status"]').selectOption("contacted");
  await page.locator('[name="note"]').fill("Synthetic recovery note");
  await page.getByRole("button", { name: "Save changes" }).click();
  const updated = await db.query("SELECT status, internal_note FROM crunchify_private.inquiries WHERE id=$1", [id]);
  assert.deepEqual(updated.rows[0], { status: "contacted", internal_note: "Synthetic recovery note" });
  console.log("Isolated wholesale and partner persistence, spam/rate limits, expired session, email failure and admin retry/update passed.");
} finally {
  if (id) await db.query("DELETE FROM crunchify_private.inquiries WHERE id=$1 AND details->>'company'=$2", [id, company]);
  await db.query("DELETE FROM crunchify_private.inquiries WHERE details->>'company'=$1", [partnerCompany]);
  await db.query("DELETE FROM crunchify_private.rate_limits WHERE key = ANY($1::text[])", [[rateKey, browserKey, `admin:${browserKey}`]]);
  await db.end();
  await browser.close();
}
