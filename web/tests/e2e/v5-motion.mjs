import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import path from "node:path";
import { writeFile } from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3010";
const output = path.resolve(
  process.env.TEST_ARTIFACT_DIR || "../concepts/v5-live",
);
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const report = { base, checks: [] };
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto(base);
  await page.locator('.product-story[data-enhanced="true"]').waitFor();
  for (const [index, slug] of [
    "banana",
    "jackfruit",
    "apple",
    "broccoli",
  ].entries()) {
    await page.locator(`#story-${slug}-crunch`).scrollIntoViewIfNeeded();
    await page.waitForFunction(
      (i) =>
        document.querySelector(".product-story")?.dataset.active === String(i),
      index,
    );
    await page.waitForFunction(
      (i) =>
        Number(
          getComputedStyle(document.querySelectorAll(".story-depth-card")[i])
            .opacity,
        ) > 0.95,
      index,
    );
    assert.equal(
      await page
        .locator(".story-index a")
        .nth(index)
        .getAttribute("aria-current"),
      "location",
    );
    await page.screenshot({
      path: path.join(output, `home-story-${slug}-1440.png`),
    });
  }
  report.checks.push(
    "All four scroll chapters and their index highlights activate",
  );
  await page.locator(".story-index a").first().click();
  await page.waitForURL("**/#story-banana-crunch");
  await page.waitForFunction(
    () => document.querySelector(".product-story")?.dataset.active === "0",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator('.product-story[data-enhanced="false"]').waitFor();
  assert.equal(await page.locator(".story-stage").count(), 0);
  assert.equal(await page.locator(".story-static-photo").count(), 4);
  report.checks.push(
    "Product anchor navigation and complete static reduced-motion layout",
  );
  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
  });
  const touch = await touchContext.newPage();
  await touch.goto(base + "/products/banana-crunch");
  const stage = touch.locator(".gallery-stage");
  await stage.scrollIntoViewIfNeeded();
  const rect = await stage.boundingBox();
  const cdp = await touchContext.newCDPSession(touch);
  const y = rect.y + rect.height / 2;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: rect.x + rect.width * 0.8, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: rect.x + rect.width * 0.2, y: y + 2 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await touch.waitForFunction(
    () =>
      document.querySelector(".gallery-stage")?.dataset.active === "texture",
  );
  assert.match(
    await stage.evaluate((el) => getComputedStyle(el).touchAction),
    /pan-y/,
  );
  assert.match(
    await stage.evaluate((el) => getComputedStyle(el).touchAction),
    /pinch-zoom/,
  );
  await touch.screenshot({ path: path.join(output, "gallery-touch-390.png") });
  await touch.goto(base);
  await touch.locator('.product-story[data-enhanced="false"]').waitFor();
  assert.equal(await touch.locator(".story-static-photo").count(), 4);
  report.checks.push(
    "Emulated touch swipe changes photo; vertical scrolling and pinch zoom remain enabled; mobile story stays complete",
  );
  await touchContext.close();
  await writeFile(
    path.join(output, "motion-review.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    `V5 motion review passed: ${report.checks.length} interaction groups.`,
  );
} finally {
  await browser.close();
}
