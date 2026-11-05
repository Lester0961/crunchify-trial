import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { chromium } from "playwright-core";
import pg from "pg";

const base = new URL(process.env.TEST_BASE_URL || "http://localhost:3127");
const dbUrl = new URL(process.env.TEST_DATABASE_URL || "postgresql://crunchify_test@127.0.0.1:59255/source_test");
const local = (host) => ["127.0.0.1", "localhost", "::1", "[::1]"].includes(host);
assert.ok(local(base.hostname) && local(dbUrl.hostname), "CRM test requires isolated local services");
const db = new pg.Client({ connectionString: dbUrl.toString() });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const marker = `Synthetic CRM ${randomUUID()}`;
const ids = [randomUUID(), randomUUID(), randomUUID()];
const rateKeys = [];
try {
  await db.connect();
  const rows = [
    { id: ids[0], kind: "wholesale", status: "new", sender: "failed", company: "failed", suffix: "wholesale" },
    { id: ids[1], kind: "partner", status: "contacted", sender: "accepted", company: "accepted", suffix: "partner" },
    { id: ids[2], kind: "wholesale", status: "closed", sender: "pending", company: "accepted", suffix: "closed" },
  ];
  for (const row of rows) {
    const details = { type: row.kind, company: `${marker} ${row.suffix}`, contact: "Synthetic contact", email: "test@example.invalid", phone: "1234567", businessType: row.kind === "wholesale" ? "Retailer" : "Media", territory: "Synthetic territory", volume: "100", products: ["banana-crunch"], message: "Synthetic CRM message", website: "", source: "/test", utm: { utm_source: "crm-test" }, submissionId: row.id };
    await db.query("INSERT INTO crunchify_private.inquiries (id,kind,details,status,sender_email_status,company_email_status) VALUES ($1,$2,$3,$4,$5,$6)", [row.id, row.kind, JSON.stringify(details), row.status, row.sender, row.company]);
  }
  for (const width of [390, 1440]) {
    await db.query("UPDATE crunchify_private.inquiries SET status='new', internal_note='' WHERE id=$1", [ids[0]]);
    const totals = await db.query("SELECT count(*)::int AS total, count(*) FILTER (WHERE status='new')::int AS new, count(*) FILTER (WHERE status='contacted')::int AS contacted FROM crunchify_private.inquiries");
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const ip = `crm-test-${randomUUID()}`;
    const rateKey = createHash("sha256").update(ip).digest("hex");
    rateKeys.push(rateKey, `admin:${rateKey}`);
    await page.setExtraHTTPHeaders({ "x-real-ip": ip });
    await page.goto(`${base.origin}/admin/login`);
    await page.locator('[name="username"]').fill("localtest");
    await page.locator('[name="password"]').fill("localtestpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/admin");
    for (const [index, key] of ["new", "contacted", "total"].entries()) assert.equal(Number(await page.locator(".admin-summary > div").nth(index).locator("strong").textContent()), totals.rows[0][key]);
    await page.locator('[name="q"]').fill(marker);
    await page.locator('[name="status"]').selectOption("contacted");
    await page.locator('[name="type"]').selectOption("partner");
    await page.getByRole("button", { name: "Apply filters" }).click();
    assert.equal(await page.locator(".admin-row").count(), 1);
    assert.equal(await page.locator(".admin-row").first().getAttribute("href"), `/admin/inquiries/${ids[1]}`);
    await page.locator('[name="status"]').selectOption("closed");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await page.getByText("No inquiries match these filters.").waitFor();
    await page.locator('[name="status"]').selectOption("new");
    await page.locator('[name="type"]').selectOption("wholesale");
    await page.getByRole("button", { name: "Apply filters" }).click();
    assert.equal(await page.locator(".admin-row").count(), 1);
    await page.getByText("Email follow-up needed").waitFor();
    await page.locator(`a[href="/admin/inquiries/${ids[0]}"]`).click();
    await page.getByText("Synthetic CRM message").waitFor();
    await page.getByText(/crm-test/).waitFor();
    await page.getByText("Sender email: failed · Company email: failed").waitFor();
    await page.getByRole("button", { name: "Retry pending emails" }).click();
    await page.getByText("Sender email: failed · Company email: failed").waitFor();
    await page.locator('[name="status"]').selectOption("contacted");
    await page.locator('[name="note"]').fill(`CRM local test ${width}`);
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.getByText(`Updated note: CRM local test ${width}`).waitFor();
    const saved = await db.query("SELECT status,internal_note FROM crunchify_private.inquiries WHERE id=$1", [ids[0]]);
    assert.deepEqual(saved.rows[0], { status: "contacted", internal_note: `CRM local test ${width}` });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal((await page.request.post(`${base.origin}/api/admin/logout`, { headers: { origin: base.origin }, maxRedirects: 0 })).status(), 303);
    await page.close();
  }
  console.log("Mixed-type CRM counts, filters, details, failed-email retry and updates passed on mobile and desktop.");
} finally {
  await db.query("DELETE FROM crunchify_private.inquiries WHERE id = ANY($1::uuid[]) AND details->>'company' LIKE $2", [ids, `${marker}%`]);
  await db.query("DELETE FROM crunchify_private.rate_limits WHERE key = ANY($1::text[])", [rateKeys]);
  await db.end();
  await browser.close();
}
