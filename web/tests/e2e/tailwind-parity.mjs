import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3010";
const mode = process.env.PARITY_MODE || "compare";
const admin = process.env.ADMIN_PARITY === "1";
if (admin && new URL(base).hostname === "crunchify.vercel.app")
  throw new Error("Use Preview for staff comparison fixtures.");
const output = path.resolve("../concepts/tailwind-review");
await mkdir(output, { recursive: true });
const baselineFile = path.join(
  output,
  `${admin ? "admin" : "public"}-style-baseline.json`,
);
const baseline =
  mode === "capture" ? {} : JSON.parse(await readFile(baselineFile, "utf8"));
const routes = admin
  ? [
      "/admin?q=V5+UI+check",
      "/admin?q=V5+UI+check&page=2",
      "/admin?q=V5+no+matches",
      "/admin/inquiries/f5000000-0000-4000-8000-000000000001",
      "/admin/inquiries/f5000000-0000-4000-8000-000000000052",
    ]
  : [
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
const viewports = [
  { width: 320, height: 900 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1440, height: 1000 },
  { width: 844, height: 390 },
];
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const differences = [];
const runtimeErrors = [];
let checked = 0;
const context = await browser.newContext({ reducedMotion: "reduce" });
let token;
try {
  if (admin) {
    const env = await readFile(".env.v5-development.local", "utf8");
    token = env
      .split(/\r?\n/)
      .find((line) => line.startsWith("VERCEL_OIDC_TOKEN="))
      ?.split("=")
      .slice(1)
      .join("=")
      .replace(/^["']|["']$/g, "");
    if (!token) throw new Error("Refresh the development deployment token.");
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
  }
  const page = await context.newPage();
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  if (admin) {
    const credentials = await readFile(".env.admin-credentials", "utf8");
    const username = credentials.match(/^Username:\s*(.+)$/m)?.[1].trim();
    const password = credentials.match(/^Password:\s*(.+)$/m)?.[1].trim();
    if (!username || !password)
      throw new Error("Missing staff test credentials.");
    await page.goto(base + "/admin/login");
    await page.locator('[name="username"]').fill(username);
    await page.locator('[name="password"]').fill(password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL("**/admin");
  }
  for (const route of routes) {
    await page.goto(base + route);
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(100);
      const key = `${route} ${viewport.width}x${viewport.height}`;
      const snapshot = await page.evaluate(() => {
        const properties = [
          "display",
          "position",
          "color",
          "backgroundColor",
          "backgroundImage",
          "fontFamily",
          "fontSize",
          "fontWeight",
          "lineHeight",
          "letterSpacing",
          "textAlign",
          "borderTopLeftRadius",
          "borderTopRightRadius",
          "borderBottomLeftRadius",
          "borderBottomRightRadius",
          "paddingTop",
          "paddingRight",
          "paddingBottom",
          "paddingLeft",
          "marginTop",
          "marginRight",
          "marginBottom",
          "marginLeft",
          "rowGap",
          "columnGap",
          "alignItems",
          "justifyContent",
          "flexDirection",
          "gridTemplateColumns",
          "boxShadow",
          "overflowX",
          "objectFit",
          "objectPosition",
        ];
        return Array.from(document.querySelectorAll("body, body *"))
          .filter(
            (element) =>
              !["SCRIPT", "STYLE", "LINK", "NOSCRIPT"].includes(
                element.tagName,
              ),
          )
          .flatMap((element) => {
            const style = getComputedStyle(element);
            if (
              style.display === "none" ||
              style.visibility === "hidden" ||
              !element.getClientRects().length
            )
              return [];
            const box = element.getBoundingClientRect();
            return [
              {
                tag: element.tagName,
                text: element.children.length
                  ? ""
                  : element.textContent.slice(0, 80),
                rect: Object.fromEntries(
                  ["x", "y", "width", "height"].map((property) => [
                    property,
                    Math.round(box[property] * 100) / 100,
                  ]),
                ),
                styles: Object.fromEntries(
                  properties.map((property) => [property, style[property]]),
                ),
              },
            ];
          });
      });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        key,
      );
      if (mode === "capture") baseline[key] = snapshot;
      else {
        const before = baseline[key];
        if (!before || before.length !== snapshot.length)
          differences.push({
            key,
            problem: "Visible element count",
            before: before?.length,
            after: snapshot.length,
          });
        else
          snapshot.forEach((element, index) => {
            const original = before[index];
            for (const property of ["tag", "text"])
              if (element[property] !== original[property])
                differences.push({
                  key,
                  index,
                  property,
                  before: original[property],
                  after: element[property],
                });
            for (const [property, value] of Object.entries(element.rect))
              if (Math.abs(value - original.rect[property]) > 0.1)
                differences.push({
                  key,
                  index,
                  property: `rect.${property}`,
                  before: original.rect[property],
                  after: value,
                });
            for (const [property, value] of Object.entries(element.styles))
              if (value !== original.styles[property])
                differences.push({
                  key,
                  index,
                  tag: element.tag,
                  property,
                  before: original.styles[property],
                  after: value,
                });
          });
      }
      if (route === "/products/banana-crunch" && viewport.width === 1440)
        await page.screenshot({
          path: path.join(output, `${mode}-product-desktop.png`),
        });
      if (route === "/inquire" && viewport.width === 390)
        await page.screenshot({
          path: path.join(output, `${mode}-inquiry-mobile.png`),
          fullPage: true,
        });
      if (
        route === "/admin?q=V5+UI+check" &&
        [390, 1440].includes(viewport.width)
      )
        await page.screenshot({
          path: path.join(output, `${mode}-admin-inbox-${viewport.width}.png`),
        });
      checked++;
    }
  }
  assert.deepEqual(runtimeErrors, [], "Browser exceptions");
  if (mode === "capture")
    await writeFile(baselineFile, JSON.stringify(baseline));
  await writeFile(
    path.join(output, `${mode}-${admin ? "admin-" : ""}parity-report.json`),
    JSON.stringify({ base, checked, differences }, null, 2),
  );
  assert.equal(
    differences.length,
    0,
    `${differences.length} visual differences; inspect ${mode}-parity-report.json`,
  );
  console.log(
    mode === "capture"
      ? `Captured ${checked} ${admin ? "staff" : "public"} baseline layouts.`
      : `Compared ${checked} ${admin ? "staff" : "public"} layouts: no visual-property or geometry differences.`,
  );
} finally {
  if (admin)
    await context.request
      .post(base + "/api/admin/logout", {
        headers: {
          Origin: new URL(base).origin,
          "x-vercel-trusted-oidc-idp-token": token,
        },
      })
      .catch(() => {});
  await context.close();
  await browser.close();
}
