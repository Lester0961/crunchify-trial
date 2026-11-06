/* Render staff layout samples from the real presentation components, without a database. */
/* eslint-disable @typescript-eslint/no-require-imports -- This isolated CommonJS renderer registers a TSX require hook. */
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const root = path.resolve(__dirname, "..");
const output = path.resolve(root, "../concepts/v4");
fs.mkdirSync(path.join(output, "assets/fonts"), { recursive: true });
fs.cpSync(path.join(root, "public/brand"), path.join(output, "assets/brand"), {
  recursive: true,
});
for (const font of ["Poppins-Regular.ttf", "Poppins-Medium.ttf"])
  fs.copyFileSync(
    path.join(root, "src/app/fonts", font),
    path.join(output, "assets/fonts", font),
  );
const load = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "next/link")
    return {
      __esModule: true,
      default: ({ href, children, ...props }) =>
        React.createElement("a", { ...props, href }, children),
    };
  if (request === "next/image")
    return {
      __esModule: true,
      default: ({ src, alt, width, height, className }) =>
        React.createElement("img", {
          src: src.replace("/brand/", "assets/brand/"),
          alt,
          width,
          height,
          className,
        }),
    };
  return load.call(
    this,
    request.startsWith("@/")
      ? path.join(root, "src", request.slice(2))
      : request,
    parent,
    isMain,
  );
};
for (const extension of [".ts", ".tsx"])
  require.extensions[extension] = (module, filename) =>
    module._compile(
      ts.transpileModule(fs.readFileSync(filename, "utf8"), {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.ReactJSX,
          target: ts.ScriptTarget.ES2020,
          esModuleInterop: true,
        },
      }).outputText,
      filename,
    );

const { AdminInbox } = require("../src/components/admin-inbox.tsx");
const { AdminDetail } = require("../src/components/admin-detail.tsx");
const { BrandLogo } = require("../src/components/brand-logo.tsx");
const { InboxIcon, OpenIcon } = require("../src/components/icons.tsx");
const {
  formatInquiryDetails,
} = require("../src/features/inquiries/display.ts");
const { products } = require("../src/features/products/data.ts");
const css = fs
  .readFileSync(path.join(root, "src/app/globals.css"), "utf8")
  .replaceAll("./fonts/", "assets/fonts/");
const sampleId = "00000000-0000-4000-8000-000000000001";
const rows = [
  ["Sample Market", "Alex Rivera", "wholesale", "new", "accepted"],
  ["Sample Studio", "Jamie Cruz", "partner", "contacted", "failed"],
  ["Sample Pantry", "Casey Santos", "wholesale", "contacted", "accepted"],
  ["Sample Retail Co.", "Sam Reyes", "wholesale", "closed", "accepted"],
].map(([company, contact, kind, status, email], index) => ({
  id: index ? `00000000-0000-4000-8000-00000000000${index + 1}` : sampleId,
  company,
  contact,
  kind,
  status,
  sender_email_status: email,
  company_email_status: "accepted",
  created_at: `2026-11-0${6 - index}T04:30:00Z`,
}));
const details = {
  company: "Sample Market",
  contact: "Alex Rivera",
  email: "sample@example.com",
  phone: "+63 900 000 0000",
  businessType: "Retailer",
  territory: "Metro Manila",
  volume: "100 packs",
  products: ["banana-crunch", "apple-crunch"],
  message:
    "We’d like to explore adding Banana and Apple Crunch to our snack selection. Please share the wholesale details.",
  source: "/products/banana-crunch",
  utm: { utm_source: "layout-review" },
};
const fields = formatInquiryDetails(
  details,
  "wholesale",
  Object.fromEntries(products.map((product) => [product.slug, product.name])),
);
function shell(content) {
  return React.createElement(
    "div",
    { className: "staff-shell" },
    React.createElement(
      "aside",
      { className: "staff-sidebar" },
      React.createElement(
        "div",
        null,
        React.createElement(BrandLogo, {
          href: "admin-inbox.html",
          label: "Admin inquiries",
        }),
        React.createElement(
          "p",
          { className: "staff-caption" },
          "Partner workspace",
        ),
      ),
      React.createElement(
        "nav",
        { "aria-label": "Staff navigation" },
        React.createElement(
          "a",
          { href: "admin-inbox.html", className: "staff-active" },
          React.createElement(InboxIcon),
          "Inquiries",
        ),
        React.createElement(
          "a",
          { href: "http://localhost:3010/" },
          React.createElement(OpenIcon),
          "View website",
        ),
      ),
      React.createElement(
        "form",
        { className: "staff-signout" },
        React.createElement("button", { type: "button" }, "Sign out"),
      ),
    ),
    React.createElement(
      "div",
      { id: "main-content", className: "staff-content" },
      content,
    ),
  );
}
const inboxProps = {
  rows,
  totals: { new: 1, contacted: 2, total: 4, email_attention: 1 },
  q: "",
  status: "",
  type: "",
  page: 1,
  pageCount: 1,
  matchCount: 4,
  offset: 0,
};
const samples = {
  "admin-inbox": shell(React.createElement(AdminInbox, inboxProps)),
  "admin-empty": shell(
    React.createElement(AdminInbox, {
      ...inboxProps,
      rows: [],
      totals: { new: 0, contacted: 0, total: 0, email_attention: 0 },
      matchCount: 0,
    }),
  ),
  "admin-detail": shell(
    React.createElement(AdminDetail, {
      id: sampleId,
      company: details.company,
      kind: "wholesale",
      createdAt: rows[0].created_at,
      fields,
      senderEmailStatus: "accepted",
      companyEmailStatus: "failed",
      status: "contacted",
      note: "Share the wholesale information and confirm the product selection.",
      notice: "saved",
      history: [
        {
          id: 1,
          actor: "admin",
          changed_at: "2026-11-06T05:00:00Z",
          old_status: "new",
          new_status: "contacted",
          old_note: "",
          new_note:
            "Share the wholesale information and confirm the product selection.",
        },
      ],
    }),
  ),
};
for (const [name, content] of Object.entries(samples))
  fs.writeFileSync(
    path.join(output, `${name}.html`),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Crunchify — ${name} layout sample</title><style>${css}</style></head><body>${renderToStaticMarkup(content)}</body></html>`,
  );
console.log(
  `Rendered ${Object.keys(samples).length} staff layout samples from application components.`,
);
if (process.argv.includes("--serve"))
  http
    .createServer((request, response) => {
      const filename = path.resolve(
        output,
        "." +
          decodeURIComponent(new URL(request.url, "http://localhost").pathname),
      );
      if (
        !filename.startsWith(output + path.sep) ||
        !fs.existsSync(filename) ||
        fs.statSync(filename).isDirectory()
      ) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      const types = {
        ".html": "text/html",
        ".webp": "image/webp",
        ".png": "image/png",
        ".ttf": "font/ttf",
        ".json": "application/json",
      };
      response.writeHead(200, {
        "Content-Type":
          types[path.extname(filename)] || "application/octet-stream",
      });
      fs.createReadStream(filename).pipe(response);
    })
    .listen(3011, "127.0.0.1", () =>
      console.log("Staff layout review listening on http://127.0.0.1:3011"),
    );
