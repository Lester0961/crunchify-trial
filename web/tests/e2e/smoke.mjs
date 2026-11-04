import { chromium } from "playwright-core";
import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3124";
const executablePath = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath, headless: true });
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(base, { waitUntil: "networkidle" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}px`);
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base);
  await page.getByText("Menu", { exact: true }).click();
  assert.equal(await page.getByRole("link", { name: "Admin login" }).first().isVisible(), true);
  await page.goto(`${base}/products?category=Vegetable`);
  assert.equal(await page.locator(".product-card").count(), 1);
  await page.goto(`${base}/inquire?product=banana-crunch`);
  assert.equal(await page.locator("input[value=banana-crunch]").isChecked(), true);
  const response = await page.request.get(`${base}/admin`, { maxRedirects: 0 });
  assert.equal(response.status(), 307);
  const invalid = await page.request.post(`${base}/api/inquiries`, { data: { type: "wholesale" } });
  assert.equal(invalid.status(), 400);
  console.log("Responsive and critical route smoke checks passed.");
} finally {
  await browser.close();
}
