import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";

const base = new URL(process.env.TEST_BASE_URL || "");
assert.ok(base.protocol === "https:" && /^crunchify-trial-[a-z0-9]+-lesters-projects-17d9e437\.vercel\.app$/.test(base.hostname), "Use the exact protected preview");
assert.ok(process.env.VERCEL_OIDC_TOKEN);
const credentials = await readFile(".env.admin-credentials", "utf8");
const username = credentials.match(/^Username\s*:\s*(.+)$/m)?.[1]?.trim();
const password = credentials.match(/^Password\s*:\s*(.+)$/m)?.[1]?.trim();
assert.ok(username && password);
const axePath = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
async function audit(page, state) {
  await page.addScriptTag({ path: axePath });
  const violations = await page.evaluate(async () => {
    const results = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
    return results.violations.map(({ id, impact, nodes }) => ({ id, impact, count: nodes.length }));
  });
  assert.deepEqual(violations, [], `${state}: ${JSON.stringify(violations)}`);
}
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } });
    const page = await context.newPage();
    await page.goto(`${base.origin}/inquire`);
    for (const [name, value] of Object.entries({ company: "   ", contact: "Synthetic validation", email: "test@example.invalid", phone: "1234567", territory: "Test", volume: "100", message: "Synthetic validation only" })) await page.locator(`[name="${name}"]`).fill(value);
    await page.locator('[name="businessType"]').selectOption("Retailer");
    await page.locator('[value="banana-crunch"]').check();
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await page.getByText("Enter your company name.").waitFor();
    await audit(page, `wholesale validation at ${width}px`);
    await page.goto(`${base.origin}/partners`);
    for (const [name, value] of Object.entries({ company: "Synthetic validation", contact: "Test", email: "test@example.invalid", message: "   " })) await page.locator(`[name="${name}"]`).fill(value);
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await page.getByText("Enter a message.").waitFor();
    await audit(page, `partner validation at ${width}px`);
    await page.goto(`${base.origin}/admin/login`);
    await page.locator('[name="username"]').fill(username);
    await page.locator('[name="password"]').fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/admin");
    await page.locator('[name="q"]').fill("Synthetic accessibility pagination 20261105");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await page.getByText("Page 1 of 2", { exact: true }).waitFor();
    await audit(page, `paginated admin at ${width}px`);
    await page.getByRole("link", { name: "Next page" }).click();
    await page.getByText("Page 2 of 2", { exact: true }).waitFor();
    await audit(page, `last admin page at ${width}px`);
    await context.close();
  }
  console.log("Axe reported zero WCAG A/AA violations in eight validation and pagination states.");
} finally { await browser.close(); }
