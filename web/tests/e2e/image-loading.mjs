import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = new URL(process.env.TEST_BASE_URL || "");
const preview = /^crunchify-trial-[a-z0-9]+-lesters-projects-17d9e437\.vercel\.app$/.test(base.hostname);
assert.ok(base.protocol === "https:" && (preview || base.hostname === "crunchify.vercel.app"), "Unexpected test host");
if (preview) assert.ok(process.env.VERCEL_OIDC_TOKEN);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2, extraHTTPHeaders: preview ? { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } : {} });
    const page = await context.newPage();
    await page.goto(base.origin);
    const hero = page.locator(".hero-photo img");
    await hero.waitFor();
    assert.equal(await hero.getAttribute("fetchpriority"), "high");
    await page.waitForFunction(() => { const image = document.querySelector(".hero-photo img"); return image?.complete && image.naturalWidth > 0; });
    const images = page.locator(".product-grid .product-photo img");
    assert.equal(await images.count(), 4);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((node) => node.decode());
      const result = await image.evaluate((node) => ({ loaded: node.naturalWidth > 0, width: Number(new URL(node.currentSrc).searchParams.get("w")) }));
      assert.ok(result.loaded);
      assert.ok(result.width > 0 && result.width <= 828, `Oversized product image at ${width}px: ${result.width}`);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await context.close();
  }
  console.log("Hero priority and responsive product images passed at mobile and desktop widths.");
} finally { await browser.close(); }
