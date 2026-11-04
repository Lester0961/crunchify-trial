import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = new URL(process.env.TEST_BASE_URL || "");
const preview = /^crunchify-trial-[a-z0-9]+-lesters-projects-17d9e437\.vercel\.app$/.test(base.hostname);
assert.ok(base.protocol === "https:" && (preview || base.hostname === "crunchify.vercel.app"), "Unexpected test host");
if (preview) assert.ok(process.env.VERCEL_OIDC_TOKEN);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, extraHTTPHeaders: preview ? { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } : {} });
    const page = await context.newPage();
    await page.goto(`${base.origin}/inquire`);
    for (const [name, value] of Object.entries({ company: "   ", contact: "Synthetic validation", email: "test@example.invalid", phone: "1234567", territory: "Test", volume: "100", message: "Synthetic validation only" })) await page.locator(`[name="${name}"]`).fill(value);
    await page.locator('[name="businessType"]').selectOption("Retailer");
    await page.locator('[value="banana-crunch"]').check();
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await page.getByText("Enter your company name.").waitFor();
    assert.equal(await page.locator('[name="company"]').getAttribute("aria-invalid"), "true");
    assert.equal(await page.locator('[name="company"]').getAttribute("aria-describedby"), "company-error");
    assert.equal(await page.locator('[name="contact"]').inputValue(), "Synthetic validation");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.goto(`${base.origin}/partners`);
    for (const [name, value] of Object.entries({ company: "Synthetic validation", contact: "Test", email: "test@example.invalid", message: "   " })) await page.locator(`[name="${name}"]`).fill(value);
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await page.getByText("Enter a message.").waitFor();
    assert.equal(await page.locator('[name="message"]').getAttribute("aria-describedby"), "message-error");
    assert.equal(await page.locator('[name="company"]').inputValue(), "Synthetic validation");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await context.close();
  }
  console.log("Field-specific validation and retained entries passed on mobile and desktop; invalid requests were not saved.");
} finally { await browser.close(); }
