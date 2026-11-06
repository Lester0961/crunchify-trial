import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3010";
const output = path.resolve(
  process.env.TEST_ARTIFACT_DIR || "../concepts/v5-live",
);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const errors = [];
const report = { base, layouts: [], interactions: [], accessibility: [] };
const routes = [
  "/",
  "/products",
  "/products/banana-crunch",
  "/products/jackfruit-crunch",
  "/products/apple-crunch",
  "/products/broccoli-crunch",
  "/wholesale",
  "/inquire",
  "/partners",
  "/privacy",
  "/v5-missing-page",
  "/admin/login",
];
const widths = [320, 390, 600, 699, 700, 701, 760, 768, 959, 960, 1024, 1440];
const settle = async (page) => {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(60);
};
async function audit(page, label) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  const violations = await page.evaluate(async () =>
    (
      await window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
      })
    ).violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
  );
  report.accessibility.push({ label, violations });
  assert.deepEqual(violations, [], `Accessibility: ${label}`);
}
async function fillWholesale(page) {
  for (const [name, value] of Object.entries({
    company: "Sample Market",
    contact: "Sample Buyer",
    email: "buyer@example.invalid",
    phone: "09123456789",
    territory: "Manila",
    volume: "100 packs",
    message: "Browser test only. Please do not send.",
  }))
    await page.locator(`[name="${name}"]`).fill(value);
  await page.locator('[name="businessType"]').selectOption("Retailer");
}
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of process.env.SKIP_LAYOUTS ? [] : routes) {
    await page.goto(base + route);
    for (const width of widths) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await settle(page);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `${route} overflows at ${width}`,
      );
      report.layouts.push({ route, width, height: width === 390 ? 844 : 900 });
      if ([390, 1440].includes(width))
        await page.screenshot({
          path: path.join(
            output,
            `${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${width}.png`,
          ),
          fullPage: true,
        });
    }
  }
  for (const viewport of process.env.SKIP_LAYOUTS
    ? []
    : [
        { width: 844, height: 390 },
        { width: 932, height: 430 },
      ]) {
    await page.setViewportSize(viewport);
    for (const route of [
      "/",
      "/products/banana-crunch",
      "/inquire",
      "/partners",
      "/admin/login",
    ]) {
      await page.goto(base + route);
      await settle(page);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `Landscape overflow: ${route}`,
      );
      report.layouts.push({ route, ...viewport });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/products");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "true",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  assert.equal(
    await page
      .locator(".menu-toggle")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  assert.equal(await page.locator(".mobile-nav").getAttribute("inert"), "");
  await menu.click();
  await page
    .locator(".mobile-nav")
    .getByRole("link", { name: "Wholesale", exact: true })
    .click();
  await page.waitForURL("**/wholesale");
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.waitForFunction(
    () =>
      document.querySelector(".menu-toggle")?.getAttribute("aria-expanded") ===
      "false",
  );
  report.interactions.push(
    "Mobile menu opens, closes, restores focus and resets at desktop",
  );

  await page.goto(base + "/products");
  const categories = page.getByRole("navigation", {
    name: "Product categories",
  });
  await categories.getByRole("link", { name: /Vegetable/ }).click();
  await page.waitForURL("**/products?category=Vegetable");
  assert.equal(await page.locator(".product-card").count(), 1);
  await categories.getByRole("link", { name: /Fruit/ }).click();
  await page.waitForURL("**/products?category=Fruit");
  assert.equal(await page.locator(".product-card").count(), 3);
  await page.goBack();
  await page.waitForURL("**/products?category=Vegetable");
  assert.equal(await page.locator(".product-card").count(), 1);
  await categories.getByRole("link", { name: /All/ }).click();
  await page.waitForURL("**/products");
  assert.equal(await page.locator(".product-card").count(), 4);
  report.interactions.push("Category counts, URL changes and browser Back");

  for (const slug of [
    "banana-crunch",
    "jackfruit-crunch",
    "apple-crunch",
    "broccoli-crunch",
  ]) {
    await page.goto(base + "/products/" + slug);
    const crunch = page.getByRole("button", {
      name: "The crunch",
      exact: true,
    });
    await crunch.click();
    await page.waitForFunction(
      () =>
        document
          .querySelector(".gallery-stage")
          ?.getAttribute("data-active") === "texture",
    );
    await crunch.press("Home");
    assert.equal(
      await page
        .getByRole("button", { name: "The pack", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.keyboard.press("End");
    assert.equal(await crunch.getAttribute("aria-pressed"), "true");
    const quote = page
      .locator(".detail-copy")
      .getByRole("link", { name: /Request.*quote/i });
    await quote.click();
    await page.waitForURL("**/inquire?product=" + slug);
    assert.equal(
      await page.locator(`[name="products"][value="${slug}"]`).isChecked(),
      true,
    );
  }
  report.interactions.push(
    "All four photo galleries, keyboard controls and exact product quote links",
  );

  let blockPhoto = true;
  await page.route("**/_next/image?**", async (route) => {
    const source = new URL(route.request().url()).searchParams.get("url");
    if (blockPhoto && source === "/brand/apple.webp") await route.abort();
    else await route.continue();
  });
  await page.goto(base + "/products/apple-crunch");
  await page.getByRole("button", { name: "The crunch", exact: true }).click();
  await page.getByRole("button", { name: "Try the photo again" }).waitFor();
  assert.equal(
    await page.locator(".gallery-stage").getAttribute("data-active"),
    "pack",
  );
  blockPhoto = false;
  await page.getByRole("button", { name: "Try the photo again" }).click();
  await page.waitForFunction(
    () =>
      document.querySelector(".gallery-stage")?.getAttribute("data-active") ===
      "texture",
  );
  await page.unroute("**/_next/image?**");
  report.interactions.push(
    "Failed photo keeps pack visible and retries successfully",
  );

  await page.goto(base + "/inquire");
  let requests = [];
  let mode = "bad-json";
  let release;
  await page.route("**/api/inquiries", async (route) => {
    requests.push(route.request().postDataJSON());
    if (mode === "pending")
      await new Promise((resolve) => {
        release = resolve;
      });
    if (mode === "bad-json")
      return route.fulfill({
        status: 502,
        contentType: "text/plain",
        body: "Temporary failure",
      });
    if (mode === "malformed")
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{}",
      });
    if (mode === "fields")
      return route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Check the highlighted detail.",
          fields: { company: ["Please check the company name."] },
        }),
      });
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        notificationPending: mode !== "pending",
      }),
    });
  });
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  assert.equal(requests.length, 0, "Empty required fields must not submit");
  await fillWholesale(page);
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await page
    .getByText("Choose at least one product.", { exact: true })
    .waitFor();
  assert.equal(requests.length, 0);
  await page.locator('[name="products"][value="banana-crunch"]').check();
  await page.getByText("9 of 9 details filled in", { exact: false }).waitFor();
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "connection was interrupted" })
    .waitFor();
  assert.equal(
    await page.locator('[name="company"]').inputValue(),
    "Sample Market",
  );
  mode = "malformed";
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "couldn’t confirm" })
    .waitFor();
  mode = "fields";
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await page.waitForFunction(
    () => document.activeElement?.getAttribute("name") === "company",
  );
  await page.locator('[name="company"]').fill("Sample Market updated");
  assert.equal(
    await page.locator('[name="company"]').getAttribute("aria-invalid"),
    null,
  );
  await audit(page, "Wholesale retained validation error");
  mode = "pending";
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await page.getByRole("button", { name: "Sending…", exact: true }).waitFor();
  assert.equal(await page.locator('[name="company"]').isDisabled(), true);
  assert.equal(
    await page
      .getByRole("button", { name: "Sending…", exact: true })
      .isDisabled(),
    true,
  );
  assert.equal(requests.length, 4);
  assert.equal(
    new Set(requests.map((r) => r.submissionId)).size,
    1,
    "Retries reuse submission ID",
  );
  release();
  await page.locator(".form-success").waitFor();
  assert.equal(
    await page
      .locator(".form-success")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await audit(page, "Wholesale success");
  await page.screenshot({
    path: path.join(output, "inquire-success-1024.png"),
    fullPage: true,
  });
  report.interactions.push(
    "Required fields, product choice, completion cue, malformed response, retained retry, field focus, duplicate prevention and success focus",
  );

  await page.goto(base + "/partners");
  for (const [name, value] of Object.entries({
    company: "Sample Studio",
    contact: "Sample Partner",
    email: "partner@example.invalid",
    message: "Synthetic collaboration test only.",
  }))
    await page.locator(`[name="${name}"]`).fill(value);
  mode = "success-pending";
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await page.locator(".form-success").waitFor();
  await page.getByText(/Some email notifications are still pending/).waitFor();
  assert.equal(requests.at(-1).businessType, "");
  assert.equal(requests.at(-1).type, "partner");
  report.interactions.push(
    "Partner inquiry keeps collaboration type optional and shows pending email notice",
  );
  await page.unroute("**/api/inquiries");

  await page.goto(base + "/wholesale");
  const disclosure = page.locator(".preparation-topic button").last();
  await disclosure.click();
  assert.equal(await disclosure.getAttribute("aria-expanded"), "true");
  await disclosure.click();
  assert.equal(await disclosure.getAttribute("aria-expanded"), "false");
  await page.goto(base + "/privacy");
  const privacyLink = page.locator(".privacy-navigation a").last();
  const anchor = await privacyLink.getAttribute("href");
  await privacyLink.click();
  assert.equal(new URL(page.url()).hash, anchor);
  await audit(page, "Privacy desktop");
  await page.goto(base + "/v5-missing-page");
  await page
    .getByRole("link", { name: "Explore products", exact: true })
    .click();
  await page.waitForURL("**/products");
  report.interactions.push(
    "Preparation disclosures, privacy anchors and 404 recovery",
  );

  await page
    .getByRole("button", { name: "Reduce motion", exact: true })
    .click();
  await page.waitForFunction(
    () => document.documentElement.dataset.reducedMotion === "true",
  );
  await page.reload();
  await page.waitForFunction(
    () => document.documentElement.dataset.reducedMotion === "true",
  );
  await categories.getByRole("link", { name: /Vegetable/ }).click();
  await page.waitForURL("**/products?category=Vegetable");
  assert.equal(
    await page
      .locator(".product-card")
      .evaluateAll((els) => els.flatMap((el) => el.getAnimations()).length),
    0,
  );
  await page
    .getByRole("button", { name: "Motion reduced", exact: true })
    .click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .getByRole("button", { name: "Motion reduced", exact: true })
    .waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Motion reduced", exact: true })
      .isDisabled(),
    true,
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  report.interactions.push(
    "Motion choice persists and respects device reduced motion",
  );

  await page.goto(base + "/admin/login");
  await page.locator('[name="username"]').fill("test-user");
  await page.locator('[name="password"]').fill("test-password");
  await page.getByRole("button", { name: "Show password" }).click();
  assert.equal(
    await page.locator('[name="password"]').getAttribute("type"),
    "text",
  );
  await page.getByRole("button", { name: "Hide password" }).click();
  await page.route("**/api/admin/login", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        error: "That username or password didn’t match.",
      }),
    }),
  );
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.locator(".login-form").getByRole("alert").waitFor();
  assert.equal(
    await page.locator('[name="username"]').inputValue(),
    "test-user",
  );
  await audit(page, "Staff login error");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/products",
    "/products/banana-crunch",
    "/inquire",
    "/partners",
    "/wholesale",
  ]) {
    await page.goto(base + route);
    await settle(page);
    await audit(page, `${route} mobile`);
  }
  assert.deepEqual(errors, [], "Browser runtime errors");
  await writeFile(
    path.join(
      output,
      process.env.SKIP_LAYOUTS
        ? "public-release-interactions.json"
        : "public-review.json",
    ),
    JSON.stringify(report, null, 2),
  );
  console.log(
    `V5 public review passed: ${report.layouts.length} layouts, ${report.interactions.length} interaction groups, ${report.accessibility.length} accessibility states.`,
  );
} finally {
  await browser.close();
}
