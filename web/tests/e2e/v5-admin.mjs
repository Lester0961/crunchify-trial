import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const base = process.env.TEST_BASE_URL;
if (!base || new URL(base).hostname === "crunchify.vercel.app")
  throw new Error("Use the isolated Preview deployment for this test.");
const origin = new URL(base).origin;
const envText = await readFile(".env.v5-development.local", "utf8");
const token = envText
  .split(/\r?\n/)
  .find((line) => line.startsWith("VERCEL_OIDC_TOKEN="))
  ?.split("=")
  .slice(1)
  .join("=")
  .replace(/^["']|["']$/g, "");
if (!token)
  throw new Error("Refresh the local development deployment token first.");
const credentials = await readFile(".env.admin-credentials", "utf8");
const username = credentials.match(/^Username:\s*(.+)$/m)?.[1].trim();
const password = credentials.match(/^Password:\s*(.+)$/m)?.[1].trim();
if (!username || !password)
  throw new Error("Local test credentials are missing.");
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
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const errors = [];
const report = { base, interactions: [], layouts: [], accessibility: [] };
async function scopedProtection(ctx) {
  await ctx.route("**/*", (route) => {
    const request = route.request();
    return route.continue({
      headers:
        new URL(request.url()).origin === origin
          ? { ...request.headers(), "x-vercel-trusted-oidc-idp-token": token }
          : request.headers(),
    });
  });
}
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
      targets: v.nodes.map((n) => n.target),
    })),
  );
  report.accessibility.push({ label, violations });
  assert.deepEqual(violations, [], label);
}
async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(output, name + ".png"),
    fullPage: true,
  });
}
await scopedProtection(context);
try {
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/admin/login");
  await page.locator('[name="username"]').fill(username);
  await page.locator('[name="password"]').fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/admin");
  await page.getByRole("heading", { name: "Inquiries", exact: true }).waitFor();
  assert.equal(await page.locator(".site-header").count(), 0);
  assert.equal(await page.locator(".site-footer").count(), 0);
  report.interactions.push("Real sign-in opens the separate staff workspace");

  await page.locator('[name="q"]').fill("V5 UI check");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await page.waitForURL("**/admin?q=V5+UI+check");
  await page.getByText("Page 1 of 2", { exact: true }).waitFor();
  assert.equal(await page.locator(".inbox-desktop tbody tr").count(), 50);
  await screenshot(page, "admin-inbox-1440");
  await audit(page, "Staff inbox desktop");
  for (const viewport of [
    { width: 320, height: 900 },
    { width: 390, height: 844 },
    { width: 600, height: 900 },
    { width: 760, height: 900 },
    { width: 768, height: 900 },
    { width: 860, height: 900 },
    { width: 861, height: 900 },
    { width: 1024, height: 900 },
    { width: 1440, height: 1000 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(80);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Inbox overflow ${viewport.width}`,
    );
    report.layouts.push({ page: "inbox", ...viewport });
    if (viewport.width === 390) {
      await screenshot(page, "admin-inbox-390");
      await audit(page, "Staff inbox mobile");
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("link", { name: "Next", exact: true }).click();
  await page.waitForURL("**/admin?q=V5+UI+check&page=2");
  assert.equal(await page.locator(".inbox-desktop tbody tr").count(), 2);
  await page
    .locator(".inbox-desktop")
    .getByRole("link", { name: "V5 UI check 51 — Sample Market", exact: true })
    .click();
  await page
    .getByRole("heading", {
      name: "V5 UI check 51 — Sample Market",
      exact: true,
    })
    .waitFor();
  const detailUrl = page.url();
  assert.equal(
    new URL(detailUrl).searchParams.get("returnTo"),
    "/admin?q=V5+UI+check&page=2",
  );
  const followup = page.locator(".followup-form");
  await followup.locator('[name="status"]').selectOption("closed");
  await followup
    .locator('[name="note"]')
    .fill("V5 browser save verified. Temporary Preview record only.");
  await page
    .getByText("Unsaved changes · kept in this tab", { exact: true })
    .waitFor();
  await page.reload();
  await page.waitForFunction(
    () =>
      document.querySelector('.followup-form [name="note"]')?.value ===
      "V5 browser save verified. Temporary Preview record only.",
  );
  report.interactions.push("A draft survives a page reload in the same tab");
  let releaseSave;
  await page.route("**/api/admin/inquiries/*?returnTo=**", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    await new Promise((resolve) => {
      releaseSave = resolve;
    });
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Temporary test interruption. Your draft is still here.",
      }),
    });
  });
  await followup
    .getByRole("button", { name: "Save changes", exact: true })
    .click();
  await followup
    .getByRole("button", { name: "Saving…", exact: true })
    .waitFor();
  assert.equal(await followup.locator('[name="note"]').isDisabled(), true);
  releaseSave();
  await followup.getByRole("alert").waitFor();
  assert.equal(
    await followup.locator('[name="note"]').inputValue(),
    "V5 browser save verified. Temporary Preview record only.",
  );
  await screenshot(page, "admin-save-error-1440");
  await page.unroute("**/api/admin/inquiries/*?returnTo=**");
  await followup
    .getByRole("button", { name: "Save changes", exact: true })
    .click();
  await followup.getByText("Changes saved.", { exact: true }).waitFor();
  await page
    .getByText("Status changed from In progress to Closed.", { exact: true })
    .waitFor();
  await page
    .locator(".admin-detail-heading .status-badge")
    .getByText("Closed", { exact: true })
    .waitFor();
  await audit(page, "Staff detail saved desktop");
  await screenshot(page, "admin-detail-1440");
  await page.setViewportSize({ width: 390, height: 844 });
  await audit(page, "Staff detail mobile");
  await screenshot(page, "admin-detail-390");
  for (const viewport of [
    { width: 320, height: 900 },
    { width: 600, height: 900 },
    { width: 760, height: 900 },
    { width: 860, height: 900 },
    { width: 861, height: 900 },
    { width: 1024, height: 900 },
    { width: 1440, height: 1000 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(80);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Detail overflow ${viewport.width}`,
    );
    report.layouts.push({ page: "detail", ...viewport });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .getByRole("link", { name: "Back to inquiries", exact: true })
    .click();
  await page.waitForURL("**/admin?q=V5+UI+check&page=2");
  const savedRow = page
    .locator(".inbox-desktop tbody tr")
    .filter({ hasText: "V5 UI check 51" });
  await savedRow.getByText("Closed", { exact: true }).waitFor();
  report.interactions.push(
    "Real save updates status, note and history, and Back keeps page and search",
  );

  await page.locator('[name="status"]').selectOption("closed");
  await page.locator('[name="type"]').selectOption("wholesale");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await page.waitForURL("**/admin?q=V5+UI+check&status=closed&type=wholesale");
  assert.equal(await page.locator(".inbox-desktop tbody tr").count(), 9);
  await page.locator('[name="q"]').fill("V5 nonexistent sample");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await page
    .getByRole("heading", { name: "No matching inquiries.", exact: true })
    .waitFor();
  await screenshot(page, "admin-empty-1440");
  await page
    .locator(".admin-filter-actions")
    .getByRole("link", { name: "Clear filters", exact: true })
    .click();
  await page.waitForURL("**/admin");
  assert.equal(await page.locator('[name="q"]').inputValue(), "");
  assert.equal(await page.locator('[name="status"]').inputValue(), "");
  report.interactions.push(
    "Search, combined status/type filters, empty result and Clear filters",
  );

  await page.goto(
    base + "/admin/inquiries/f5000000-0000-4000-8000-000000000001",
  );
  const retry = page.getByRole("button", {
    name: "Retry pending emails",
    exact: true,
  });
  let releaseRetry;
  await page.route("**/api/admin/inquiries/*/retry?**", async (route) => {
    await new Promise((resolve) => {
      releaseRetry = resolve;
    });
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Test interruption. Review the email status before retrying.",
      }),
    });
  });
  await retry.click();
  assert.equal(
    await page
      .getByRole("button", { name: "Retrying…", exact: true })
      .isDisabled(),
    true,
  );
  releaseRetry();
  await page.locator(".admin-email-card").getByRole("alert").waitFor();
  await screenshot(page, "admin-email-error-1440");
  await page.unroute("**/api/admin/inquiries/*/retry?**");
  await page.route("**/api/admin/inquiries/*/retry?**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        retried: true,
        senderEmailStatus: "pending",
        companyEmailStatus: "accepted",
      }),
    }),
  );
  await retry.click();
  await page
    .getByText("Retry finished. Some emails still need attention.", {
      exact: true,
    })
    .waitFor();
  await page.unroute("**/api/admin/inquiries/*/retry?**");
  report.interactions.push(
    "Email retry waiting, uncertainty and attention states (simulated; no emails sent)",
  );

  const requestHeaders = {
    Origin: origin,
    Accept: "application/json",
    "x-vercel-trusted-oidc-idp-token": token,
  };
  const missing = await context.request.post(
    base + "/api/admin/inquiries/f5000000-0000-4000-8000-000000000099",
    {
      headers: requestHeaders,
      form: { status: "closed", note: "Missing record test" },
    },
  );
  assert.equal(missing.status(), 404);
  const acceptedRetry = await context.request.post(
    base + "/api/admin/inquiries/f5000000-0000-4000-8000-000000000051/retry",
    { headers: requestHeaders },
  );
  assert.equal(acceptedRetry.status(), 200);
  assert.deepEqual(await acceptedRetry.json(), {
    retried: true,
    senderEmailStatus: "accepted",
    companyEmailStatus: "accepted",
  });
  report.interactions.push(
    "Missing record returns an error and already-accepted email retry sends nothing",
  );

  const native = await browser.newContext({
    javaScriptEnabled: false,
    storageState: await context.storageState(),
    viewport: { width: 390, height: 844 },
  });
  await scopedProtection(native);
  const nativePage = await native.newPage();
  await nativePage.goto(detailUrl);
  await nativePage
    .locator('.followup-form [name="note"]')
    .fill("V5 native form save verified. Temporary Preview record only.");
  await nativePage
    .getByRole("button", { name: "Save changes", exact: true })
    .click();
  await nativePage.waitForURL("**/admin/inquiries/*?saved=1&returnTo=**");
  assert.equal(
    new URL(nativePage.url()).searchParams.get("returnTo"),
    "/admin?q=V5+UI+check&page=2",
  );
  await nativePage.getByText("Changes saved.", { exact: true }).waitFor();
  await native.close();
  report.interactions.push(
    "Native form fallback saves and retains the original inbox link",
  );

  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.waitForURL("**/admin/login");
  const loggedOut = await context.request.get(base + "/admin", {
    headers: { "x-vercel-trusted-oidc-idp-token": token },
    maxRedirects: 0,
  });
  assert.equal(loggedOut.status(), 307);
  report.interactions.push("Real sign-out ends staff access");
  assert.deepEqual(errors, [], "Browser runtime errors");
  await writeFile(
    path.join(output, "admin-review.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    `V5 admin review passed: ${report.layouts.length} layouts, ${report.interactions.length} interaction groups, ${report.accessibility.length} accessibility states.`,
  );
} finally {
  await context.request
    .post(base + "/api/admin/logout", {
      headers: { Origin: origin, "x-vercel-trusted-oidc-idp-token": token },
    })
    .catch(() => {});
  await context.close();
  await browser.close();
}
