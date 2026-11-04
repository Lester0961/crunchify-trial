import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { chromium } from "playwright-core";
import pg from "pg";

const base = new URL(process.env.TEST_BASE_URL || "http://localhost:3127");
const dbUrl = new URL(process.env.TEST_DATABASE_URL || "postgresql://crunchify_test@127.0.0.1:59255/source_test");
const local = (host) => ["127.0.0.1", "localhost", "::1", "[::1]"].includes(host);
assert.ok(local(base.hostname) && local(dbUrl.hostname), "Pagination test requires isolated local services");
const db = new pg.Client({ connectionString: dbUrl.toString() });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const company = `Synthetic pagination ${randomUUID()}`;
let ids = [];
try {
  await db.connect();
  const inserted = await db.query(`INSERT INTO crunchify_private.inquiries (id, kind, details)
    SELECT gen_random_uuid(), 'wholesale', jsonb_build_object('company', $1::text, 'contact', 'Synthetic contact')
    FROM generate_series(1,205) RETURNING id`, [company]);
  ids = inserted.rows.map((row) => row.id);
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.setExtraHTTPHeaders({ "x-real-ip": `pagination-${randomUUID()}` });
    await page.goto(`${base.origin}/admin/login`);
    await page.locator('[name="username"]').fill("localtest");
    await page.locator('[name="password"]').fill("localtestpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/admin");
    await page.locator('[name="q"]').fill(company);
    await page.locator('[name="status"]').selectOption("new");
    await page.locator('[name="type"]').selectOption("wholesale");
    await page.getByRole("button", { name: "Apply filters" }).click();
    const seen = new Set();
    for (let number = 1; number <= 5; number++) {
      await page.getByText(`Page ${number} of 5`, { exact: true }).waitFor();
      const hrefs = await page.locator(".admin-list a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      assert.equal(hrefs.length, number === 5 ? 5 : 50);
      for (const href of hrefs) { assert.ok(!seen.has(href), "Inquiry repeated between pages"); seen.add(href); }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "Pagination overflowed viewport");
      if (number < 5) await page.getByRole("link", { name: "Next page" }).click();
    }
    assert.equal(seen.size, 205, "All matching inquiries must remain reachable");
    assert.equal(new URL(page.url()).searchParams.get("q"), company);
    assert.equal(new URL(page.url()).searchParams.get("status"), "new");
    assert.equal(new URL(page.url()).searchParams.get("type"), "wholesale");
    await page.getByRole("link", { name: "Previous page" }).click();
    await page.getByText("Page 4 of 5", { exact: true }).waitFor();
    await page.close();
  }
  console.log("Pagination reached 205 matching inquiries without duplicates and preserved filters on mobile and desktop.");
} finally {
  if (ids.length) await db.query("DELETE FROM crunchify_private.inquiries WHERE id = ANY($1::uuid[]) AND details->>'company'=$2", [ids, company]);
  await db.end();
  await browser.close();
}
