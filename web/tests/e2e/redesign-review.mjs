import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3010";
const samples = "http://127.0.0.1:3011";
const output = path.resolve("../concepts/v4");
await mkdir(path.join(output, "shots"), { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const routes = [
  ["home", "/"],
  ["products", "/products"],
  ["fruit", "/products?category=Fruit"],
  ["vegetable", "/products?category=Vegetable"],
  ["banana", "/products/banana-crunch"],
  ["jackfruit", "/products/jackfruit-crunch"],
  ["apple", "/products/apple-crunch"],
  ["broccoli", "/products/broccoli-crunch"],
  ["wholesale", "/wholesale"],
  ["inquiry", "/inquire"],
  ["brand-media", "/partners"],
  ["privacy", "/privacy"],
  ["not-found", "/layout-review-missing"],
  ["staff-login", "/admin/login"],
];
const widths = [320, 390, 700, 701, 760, 768, 960, 1024, 1440];
const shots = [];
async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => image.loading !== "lazy")
        .map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                image.onload = resolve;
                image.onerror = resolve;
              }),
        ),
    );
  });
}
async function overflow(page, name, width) {
  const result = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    width: innerWidth,
  }));
  assert.ok(
    result.scroll <= result.width + 1,
    `${name} overflow at ${width}px: ${JSON.stringify(result)}`,
  );
}
async function capture(page, name, label, viewport) {
  for (const image of await page.locator("img").all())
    if (await image.isVisible()) await image.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState("networkidle");
  await settle(page);
  await page.screenshot({
    path: path.join(output, "shots", `${name}-${viewport}.png`),
    fullPage: true,
  });
  shots.push({ name, label, viewport, file: `shots/${name}-${viewport}.png` });
}
async function audit(page, name) {
  await page.addScriptTag({
    path: createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  });
  const violations = await page.evaluate(async () =>
    (
      await window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
        },
      })
    ).violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map((node) => node.target),
    })),
  );
  assert.deepEqual(violations, [], `${name}: ${JSON.stringify(violations)}`);
}
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of process.env.SKIP_LAYOUT_MATRIX ? [] : widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, route] of routes) {
      const response = await page.goto(base + route, {
        waitUntil: "networkidle",
      });
      assert.ok(
        response.status() < 500,
        `${route} returned ${response.status()}`,
      );
      await settle(page);
      await overflow(page, name, width);
    }
    for (const name of ["admin-inbox", "admin-empty", "admin-detail"]) {
      await page.goto(`${samples}/${name}.html`, { waitUntil: "networkidle" });
      await settle(page);
      await overflow(page, name, width);
    }
  }
  console.log(
    process.env.SKIP_LAYOUT_MATRIX
      ? "Previously completed layout matrix skipped; running focused interactions and visual capture."
      : "17 public/staff layouts passed all 9 widths, including breakpoint edges.",
  );

  await page.setViewportSize({ width: 701, height: 900 });
  await page.goto(base);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Products", exact: true })
    .click();
  await page.waitForURL("**/products");
  assert.equal(
    await page
      .getByRole("button", { name: "Menu", exact: true })
      .getAttribute("aria-expanded"),
    "false",
  );
  await page.getByRole("link", { name: /^Fruit/ }).click();
  await page.waitForURL("**/products?category=Fruit");
  await page.waitForFunction(
    () => document.querySelectorAll(".product-card").length === 3,
  );
  assert.equal(await page.locator(".product-card").count(), 3);
  await page.goto(`${base}/inquire?product=apple-crunch`);
  assert.equal(await page.locator('[value="apple-crunch"]').isChecked(), true);
  console.log(
    "Menu closes after navigation; filters and product preselection work.",
  );

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  await page.locator('.product-story[data-enhanced="true"]').waitFor();
  for (const [index, product] of [
    "banana",
    "jackfruit",
    "apple",
    "broccoli",
  ].entries()) {
    await page.locator(`#story-${product}-crunch`).scrollIntoViewIfNeeded();
    await page.waitForFunction(
      (index) =>
        document.querySelector(".product-story").dataset.active ===
        String(index),
      index,
    );
    await page.waitForFunction(
      (index) =>
        Number(
          getComputedStyle(
            document.querySelectorAll(".story-depth-card")[index],
          ).opacity,
        ) > 0.99,
      index,
    );
    const filename = `home-story-${product}-desktop.png`;
    await page.screenshot({ path: path.join(output, "shots", filename) });
    shots.push({
      name: `home-story-${product}`,
      label: `Scroll story — ${product}`,
      viewport: "desktop",
      file: `shots/${filename}`,
    });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  assert.equal(
    await page.locator(".product-story").getAttribute("data-enhanced"),
    "false",
  );
  assert.equal(
    await page.locator(".story-static-photo").first().isVisible(),
    true,
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  console.log(
    "All four scroll chapters activate; reduced-motion view remains static and complete.",
  );

  for (const [viewport, width] of [
    ["desktop", 1440],
    ["mobile", 390],
  ]) {
    await page.setViewportSize({
      width,
      height: viewport === "mobile" ? 844 : 1000,
    });
    for (const [name, route] of routes.filter(
      ([name]) => !["fruit", "vegetable"].includes(name),
    )) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      if (name === "home" && viewport === "desktop")
        await page.emulateMedia({ reducedMotion: "reduce" });
      await capture(page, name, name.replaceAll("-", " "), viewport);
      if (
        ["home", "inquiry", "brand-media", "staff-login", "banana"].includes(
          name,
        )
      )
        await audit(page, `${name} ${viewport}`);
      await page.emulateMedia({ reducedMotion: "no-preference" });
    }
    for (const name of ["admin-inbox", "admin-empty", "admin-detail"]) {
      await page.goto(`${samples}/${name}.html`, { waitUntil: "networkidle" });
      await capture(
        page,
        name,
        `${name.replaceAll("-", " ")} — sample data`,
        viewport,
      );
      await audit(page, `${name} ${viewport}`);
    }
    await page.goto(`${base}/inquire?product=banana-crunch`);
    let release;
    let submitted;
    let intercepted;
    const requestReady = new Promise((resolve) => {
      intercepted = resolve;
    });
    await page.route("**/api/inquiries", async (route) => {
      submitted = route.request().postDataJSON();
      await new Promise((resolve) => {
        release = resolve;
        intercepted();
      });
      await route.fulfill({
        status: 503,
        contentType: "text/html",
        body: "Unavailable",
      });
    });
    for (const [name, value] of Object.entries({
      company: "Sample retailer",
      contact: "Sample contact",
      email: "sample@example.com",
      phone: "09000000000",
      territory: "Metro Manila",
      volume: "100 packs",
      message: "Sample layout review only.",
    }))
      await page.locator(`[name="${name}"]`).fill(value);
    await page.locator('[name="businessType"]').selectOption("Retailer");
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await page.getByRole("button", { name: "Sending…" }).waitFor();
    await requestReady;
    assert.equal(await page.locator('[name="company"]').isDisabled(), true);
    release();
    await page.locator(".inquiry-form").getByRole("alert").waitFor();
    assert.match(
      await page.locator(".inquiry-form").getByRole("alert").innerText(),
      /connection was interrupted/i,
    );
    assert.equal(
      await page.locator('[name="company"]').inputValue(),
      "Sample retailer",
    );
    assert.equal(submitted.products[0], "banana-crunch");
    await capture(
      page,
      "inquiry-error",
      "Inquiry retry — simulated response",
      viewport,
    );
    await page.unroute("**/api/inquiries");
    await page.route("**/api/inquiries", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, notificationPending: false }),
      }),
    );
    await page.getByRole("button", { name: "Try again" }).click();
    await page.locator(".form-success").waitFor();
    await capture(
      page,
      "inquiry-success",
      "Inquiry success — simulated response",
      viewport,
    );
    await audit(page, `form success ${viewport}`);
    await page.unroute("**/api/inquiries");
    await page.goto(`${base}/partners`);
    await page.route("**/api/inquiries", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, notificationPending: true }),
      }),
    );
    for (const [name, value] of Object.entries({
      company: "Sample studio",
      contact: "Sample contact",
      email: "sample@example.com",
      message: "Sample collaboration layout review.",
    }))
      await page.locator(`[name="${name}"]`).fill(value);
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await page.locator(".form-success").waitFor();
    await capture(
      page,
      "partner-pending",
      "Brand inquiry pending email — simulated response",
      viewport,
    );
    await page.unroute("**/api/inquiries");
  }
  assert.deepEqual(errors, [], `Browser exceptions: ${JSON.stringify(errors)}`);
  await writeFile(
    path.join(output, "manifest.json"),
    JSON.stringify(shots, null, 2),
  );
  const cards = shots
    .map(
      (shot) =>
        `<a class="review-card" href="${shot.file}" data-viewport="${shot.viewport}"><img loading="lazy" src="${shot.file}" alt="${shot.label} ${shot.viewport}"><div><span>${shot.label}</span><small>${shot.viewport}</small></div></a>`,
    )
    .join("");
  await writeFile(
    path.join(output, "index.html"),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Crunchify — complete UI review</title><style>@font-face{font-family:Poppins;src:url('assets/fonts/Poppins-Regular.ttf')}*{box-sizing:border-box}body{margin:0;background:#fffdf5;color:#25362d;font:15px/1.6 Poppins,Arial,sans-serif}main{max-width:1400px;margin:auto;padding:40px 24px}h1{font-size:clamp(30px,4vw,56px);font-weight:400;letter-spacing:-.04em;margin:0}p{max-width:780px;color:#626758}nav{display:flex;gap:10px;flex-wrap:wrap;margin:28px 0}button{font:inherit;padding:10px 20px;border:1px solid #234b3b;border-radius:30px;background:transparent;color:#234b3b;cursor:pointer}button[aria-pressed=true]{background:#234b3b;color:white}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}.review-card{border:1px solid #dedfd3;border-radius:14px;overflow:hidden;text-decoration:none;color:inherit;background:white}.review-card[hidden]{display:none}.review-card img{display:block;width:100%;height:320px;object-fit:cover;object-position:top;border-bottom:1px solid #dedfd3}.review-card div{padding:16px}.review-card span{display:block;text-transform:capitalize}.review-card small{color:#626758}a:focus-visible,button:focus-visible{outline:3px solid #234b3b;outline-offset:4px}</style></head><body><main><h1>Crunchify, with a little more character.</h1><p>Complete desktop and mobile UI review. The original logo and product photography are retained. Staff screens use clearly labeled sample data; form outcome screens use simulated responses. Open a screen to inspect its full layout.</p><nav aria-label="Screen size"><button aria-pressed="true" data-size="all">All screens</button><button aria-pressed="false" data-size="desktop">Desktop</button><button aria-pressed="false" data-size="mobile">Mobile</button></nav><div class="grid">${cards}</div></main><script>document.querySelectorAll('[data-size]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-size]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));document.querySelectorAll('[data-viewport]').forEach(card=>card.hidden=button.dataset.size!=='all'&&card.dataset.viewport!==button.dataset.size)}));</script></body></html>`,
  );
  console.log(
    `${shots.length} page/state screenshots saved; axe checks and simulated form flows passed. No database writes or emails.`,
  );
} finally {
  await browser.close();
}
