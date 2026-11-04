import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const base = new URL(process.env.TEST_BASE_URL || "");
assert.ok(base.protocol === "https:" && /^crunchify-trial-[a-z0-9]+-lesters-projects-17d9e437\.vercel\.app$/.test(base.hostname), "Use an exact Crunchify preview deployment");
assert.ok(process.env.VERCEL_OIDC_TOKEN, "A short-lived Vercel token is required");
const credentials = await readFile(".env.admin-credentials", "utf8");
const username = credentials.match(/^Username\s*:\s*(.+)$/m)?.[1]?.trim();
const password = credentials.match(/^Password\s*:\s*(.+)$/m)?.[1]?.trim();
assert.ok(username && password);
const company = "Synthetic pagination deployed 20261105";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } });
    const page = await context.newPage();
    await page.goto(`${base.origin}/admin/login`);
    await page.locator('[name="username"]').fill(username);
    await page.locator('[name="password"]').fill(password);
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
      for (const href of hrefs) { assert.ok(!seen.has(href)); seen.add(href); }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      if (number < 5) await page.getByRole("link", { name: "Next page" }).click();
    }
    assert.equal(seen.size, 205);
    assert.equal(new URL(page.url()).searchParams.get("q"), company);
    assert.equal(new URL(page.url()).searchParams.get("status"), "new");
    assert.equal(new URL(page.url()).searchParams.get("type"), "wholesale");
    await page.getByRole("link", { name: "Previous page" }).click();
    await page.getByText("Page 4 of 5", { exact: true }).waitFor();
    await context.close();
  }
  console.log("Preview pagination passed for 205 synthetic inquiries at mobile and desktop widths.");
} finally { await browser.close(); }
