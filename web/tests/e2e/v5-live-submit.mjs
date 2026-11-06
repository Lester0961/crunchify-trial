import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.env.TEST_BASE_URL;
const email = process.env.TEST_INQUIRY_EMAIL;
if (
  process.env.RUN_LIVE_EMAIL_TESTS !== "1" ||
  !base ||
  !email ||
  new URL(base).hostname === "crunchify.vercel.app"
)
  throw new Error(
    "Explicitly enable the live email test with an authorized test address and the isolated Preview URL.",
  );
const env = await readFile(".env.v5-development.local", "utf8");
const token = env
  .split(/\r?\n/)
  .find((line) => line.startsWith("VERCEL_OIDC_TOKEN="))
  ?.split("=")
  .slice(1)
  .join("=")
  .replace(/^["']|["']$/g, "");
if (!token) throw new Error("Refresh the development deployment token first.");
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const report = { base, submissions: [] };
await context.route("**/*", (route) =>
  route.continue({
    headers:
      new URL(route.request().url()).origin === new URL(base).origin
        ? {
            ...route.request().headers(),
            "x-vercel-trusted-oidc-idp-token": token,
          }
        : route.request().headers(),
  }),
);
try {
  const page = await context.newPage();
  for (const type of ["wholesale", "partner"]) {
    await page.goto(
      `${base}/${type === "wholesale" ? "inquire" : "partners"}?utm_source=v5-live-review`,
    );
    await page.locator('[name="company"]').fill(`V5 live form check — ${type}`);
    await page.locator('[name="contact"]').fill("Crunchify trial UI check");
    await page.locator('[name="email"]').fill(email);
    await page
      .locator('[name="message"]')
      .fill(
        "Authorized trial test of the updated website form. This is a test inquiry; no business follow-up is needed.",
      );
    if (type === "wholesale") {
      await page.locator('[name="businessType"]').selectOption("Retailer");
      await page.locator('[name="territory"]').fill("Manila — test only");
      await page.locator('[name="phone"]').fill("09123456789");
      await page.locator('[name="volume"]').fill("100 packs — test only");
      await page.locator('[value="banana-crunch"]').check();
      await page.locator('[value="broccoli-crunch"]').check();
    }
    const [response] = await Promise.all([
      page.waitForResponse(
        (r) =>
          new URL(r.url()).pathname === "/api/inquiries" &&
          r.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Send inquiry", exact: true }).click(),
    ]);
    assert.equal(response.status(), 200);
    const outcome = await response.json();
    assert.equal(outcome.ok, true);
    assert.equal(
      outcome.notificationPending,
      false,
      "Both provider requests should be accepted",
    );
    const submissionId = response.request().postDataJSON().submissionId;
    await page.locator(".form-success").waitFor();
    await page.screenshot({
      path: path.resolve(`../concepts/v5-live/live-${type}-success-390.png`),
      fullPage: true,
    });
    report.submissions.push({
      type,
      submissionId,
      notificationPending: outcome.notificationPending,
    });
  }
  await writeFile(
    path.resolve("../concepts/v5-live/live-submissions.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
} finally {
  await context.close();
  await browser.close();
}
