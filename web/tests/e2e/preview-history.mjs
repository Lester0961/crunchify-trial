import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const base = new URL(process.env.TEST_BASE_URL || "");
assert.ok(["crunchify-trial-n4dbt96hs-lesters-projects-17d9e437.vercel.app", "crunchify.vercel.app"].includes(base.hostname), "Unexpected test host");
if (base.hostname !== "crunchify.vercel.app") assert.ok(process.env.VERCEL_OIDC_TOKEN, "A short-lived Vercel token is required");
const credentials = await readFile(".env.admin-credentials", "utf8");
const username = credentials.match(/^Username\s*:\s*(.+)$/m)?.[1]?.trim();
const password = credentials.match(/^Password\s*:\s*(.+)$/m)?.[1]?.trim();
assert.ok(username && password, "Local admin credentials are required");
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, extraHTTPHeaders: base.hostname === "crunchify.vercel.app" ? {} : { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } });
  const page = await context.newPage();
  await page.goto(`${base.origin}/admin/login`);
  await page.locator('[name="username"]').fill(username);
  await page.locator('[name="password"]').fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/admin");
  await page.goto(`${base.origin}/admin/inquiries/ed8a4b34-6d89-44f1-b29b-6d7905fd823c`);
  await page.getByRole("heading", { name: "Synthetic history deployment test" }).waitFor();
  await page.locator('[name="status"]').selectOption("contacted");
  await page.locator('[name="note"]').fill("Synthetic deployment history test");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByText("Status: new → contacted").waitFor();
  await page.getByText("Updated note: Synthetic deployment history test").waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "mobile overflow");
  console.log("Admin update and mobile history display passed.");
} finally {
  await browser.close();
}
