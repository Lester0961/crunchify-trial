import { chromium } from "playwright-core";
import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : { channel: "chrome" }),
  headless: true,
});
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
  await page.evaluate(() => sessionStorage.removeItem("crunchify_attribution"));
  await page.goto(`${base}/?utm_source=smoke-test&utm_campaign=trial`);
  await page.getByRole("link", { name: "Become a Wholesale Partner" }).first().click();
  let submitted;
  await page.route("**/api/inquiries", async route => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, notificationPending: false }) });
  });
  for (const [name, value] of Object.entries({ company: "Test company", contact: "Test person", email: "test@example.invalid", phone: "1234567", territory: "Test", volume: "100", message: "Synthetic browser test" })) {
    await page.locator(`[name="${name}"]`).fill(value);
  }
  await page.locator('[name="businessType"]').selectOption("Retailer");
  await page.locator('[value="banana-crunch"]').check();
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await page.getByText("Your inquiry has been saved.").waitFor();
  assert.equal(submitted.source, "/");
  assert.equal(submitted.utm.utm_source, "smoke-test");
  assert.equal(submitted.utm.utm_campaign, "trial");
  assert.deepEqual(submitted.products, ["banana-crunch"]);
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(`${base}/inquire`);
  assert.equal(await noJsPage.locator("form.inquiry-form").getAttribute("method"), "post");
  assert.equal(await noJsPage.locator("form.inquiry-form").getAttribute("action"), "/api/inquiries");
  assert.match(await noJsPage.locator("noscript").innerText(), /enable JavaScript/i);
  await noJs.close();
  if (process.env.ADMIN_TEST_USER && process.env.ADMIN_TEST_PASSWORD) {
    for (const width of [390, 1440]) {
      const admin = await browser.newPage({ viewport: { width, height: 900 } });
      await admin.goto(`${base}/admin/login`);
      await admin.locator('[name="username"]').fill(process.env.ADMIN_TEST_USER);
      await admin.locator('[name="password"]').fill(process.env.ADMIN_TEST_PASSWORD);
      await admin.getByRole("button", { name: "Sign in" }).click();
      await admin.waitForURL("**/admin");
      const signOut = admin.getByRole("button", { name: "Sign out" });
      assert.equal(await signOut.isVisible(), true, `sign out hidden at ${width}px`);
      assert.equal(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `admin overflow at ${width}px`);
      await signOut.click();
      await admin.waitForURL("**/admin/login");
      const loggedOut = await admin.request.get(`${base}/admin`, { maxRedirects: 0 });
      assert.equal(loggedOut.status(), 307);
      await admin.close();
    }
  }
  console.log("Responsive and critical route smoke checks passed.");
} finally {
  await browser.close();
}
