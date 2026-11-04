import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { chromium } from "playwright-core";
import pg from "pg";

const base = new URL(process.env.TEST_BASE_URL || "http://localhost:3127");
const dbUrl = new URL(process.env.TEST_DATABASE_URL || "postgresql://crunchify_test@127.0.0.1:59255/source_test");
const local = (host) => ["127.0.0.1", "localhost", "::1", "[::1]"].includes(host);
assert.ok(local(base.hostname) && local(dbUrl.hostname), "Keyboard test requires isolated local services");
const db = new pg.Client({ connectionString: dbUrl.toString() });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const companies = [];
const rateKeys = [];

async function tabUntil(page, predicate, description) {
  for (let step = 0; step < 80; step++) {
    await page.keyboard.press("Tab");
    const active = await page.evaluate(() => {
      const node = document.activeElement;
      return { name: node?.getAttribute("name"), tag: node?.tagName, text: node?.textContent?.trim(), type: node?.getAttribute("type") };
    });
    if (predicate(active)) return;
  }
  assert.fail(`Keyboard focus did not reach ${description}`);
}
async function fillByKeyboard(page, name, value) {
  await tabUntil(page, (active) => active.name === name, name);
  await page.keyboard.type(value);
}
try {
  await db.connect();
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const ip = `keyboard-test-${randomUUID()}`;
    const rateKey = createHash("sha256").update(ip).digest("hex");
    rateKeys.push(rateKey, `admin:${rateKey}`);
    await page.setExtraHTTPHeaders({ "x-real-ip": ip });
    await page.goto(base.origin);
    if (width === 390) {
      await tabUntil(page, (active) => active.tag === "SUMMARY" && active.text === "Menu", "mobile menu");
      await page.keyboard.press("Enter");
      assert.equal(await page.locator("details.mobile-menu").evaluate((node) => node.open), true);
      await page.keyboard.press("Enter");
    }
    for (const kind of ["wholesale", "partner"]) {
      const company = `Synthetic keyboard ${randomUUID()}`;
      companies.push(company);
      await page.goto(`${base.origin}/${kind === "wholesale" ? "inquire" : "partners"}`);
      await fillByKeyboard(page, "company", company);
      await fillByKeyboard(page, "contact", "Keyboard test");
      await fillByKeyboard(page, "email", "test@example.invalid");
      if (kind === "wholesale") {
        await fillByKeyboard(page, "phone", "1234567");
        await tabUntil(page, (active) => active.name === "businessType", "business type");
        await page.keyboard.press("ArrowDown");
        await fillByKeyboard(page, "territory", "Test");
        await fillByKeyboard(page, "volume", "100");
        await tabUntil(page, (active) => active.name === "products" && active.type === "checkbox", "product choice");
        await page.keyboard.press("Space");
      } else {
        await fillByKeyboard(page, "businessType", "Media");
      }
      await fillByKeyboard(page, "message", "Synthetic keyboard navigation test");
      await tabUntil(page, (active) => active.tag === "BUTTON" && active.text === "Send inquiry", "submit inquiry");
      await page.keyboard.press("Enter");
      await page.getByText("Your inquiry has been saved.").waitFor();
      assert.equal((await db.query("SELECT count(*)::int AS count FROM crunchify_private.inquiries WHERE details->>'company'=$1", [company])).rows[0].count, 1);
    }
    await page.goto(`${base.origin}/admin/login`);
    await fillByKeyboard(page, "username", "localtest");
    await fillByKeyboard(page, "password", "localtestpassword");
    await tabUntil(page, (active) => active.tag === "BUTTON" && active.text === "Sign in", "staff sign-in");
    await page.keyboard.press("Enter");
    await page.waitForURL("**/admin");
    const selectedCompany = companies[companies.length - 1];
    await tabUntil(page, (active) => active.tag === "A" && active.text?.includes(selectedCompany), "inquiry details");
    await page.keyboard.press("Enter");
    await page.waitForURL("**/admin/inquiries/**");
    await tabUntil(page, (active) => active.name === "status", "inquiry status");
    await page.keyboard.press("ArrowDown");
    await fillByKeyboard(page, "note", "Keyboard follow-up");
    await tabUntil(page, (active) => active.tag === "BUTTON" && active.text === "Save changes", "save changes");
    await page.keyboard.press("Enter");
    await page.getByText("Updated note: Keyboard follow-up").waitFor();
    const saved = await db.query("SELECT status, internal_note FROM crunchify_private.inquiries WHERE details->>'company'=$1", [selectedCompany]);
    assert.deepEqual(saved.rows[0], { status: "contacted", internal_note: "Keyboard follow-up" });
    await tabUntil(page, (active) => active.tag === "A" && active.text === "All inquiries", "return to inquiries");
    await page.keyboard.press("Enter");
    await page.waitForURL("**/admin");
    await tabUntil(page, (active) => active.tag === "BUTTON" && active.text === "Sign out", "staff sign-out");
    await page.keyboard.press("Enter");
    await page.waitForURL("**/admin/login");
    await page.close();
  }
  console.log("Keyboard-only menu, both inquiry forms, staff sign-in, inquiry update and sign-out passed at mobile and desktop widths.");
} finally {
  for (const company of companies) await db.query("DELETE FROM crunchify_private.inquiries WHERE details->>'company'=$1", [company]);
  await db.query("DELETE FROM crunchify_private.rate_limits WHERE key = ANY($1::text[])", [rateKeys]);
  await db.end();
  await browser.close();
}
