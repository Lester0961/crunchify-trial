import assert from "node:assert/strict";
import test from "node:test";
import { formatInquiryDetails } from "../../src/features/inquiries/display.ts";

test("shows inquiry details in a readable order while retaining attribution and extra fields", () => {
  const details = {
    company: "Example", type: "wholesale", contact: "Person", email: "test@example.invalid", phone: "123",
    businessType: "Retailer", territory: "Example territory", volume: "100", products: ["banana-crunch", "unknown-product"],
    message: "Hello", source: "/products", utm: { utm_source: "campaign", utm_campaign: "launch" },
    extraField: "Keep me", submissionId: "internal-id", website: "",
  };
  const fields = formatInquiryDetails(details, "wholesale", { "banana-crunch": "Banana Crunch" });
  assert.deepEqual(fields.map((field) => field.label), ["Contact person", "Email address", "Phone or WhatsApp", "Business type", "Territory or location", "Estimated monthly volume", "Products of interest", "Message", "First page visited", "UTM source", "UTM campaign", "Extra Field"]);
  assert.equal(fields.find((field) => field.key === "products")?.value, "Banana Crunch, unknown-product");
  assert.equal(fields.find((field) => field.key === "utm:utm_source")?.value, "campaign");
  assert.equal(fields.find((field) => field.key === "other:extraField")?.value, "Keep me");
});

test("uses the partner label and handles incomplete or legacy data", () => {
  const fields = formatInquiryDetails({ businessType: "Media", utm: "legacy", products: [], other: { nested: true } }, "partner", {});
  assert.deepEqual(fields, [
    { key: "businessType", label: "Collaboration type", value: "Media" },
    { key: "utm", label: "UTM", value: "legacy" },
    { key: "other:other", label: "Other", value: '{"nested":true}' },
  ]);
  assert.deepEqual(formatInquiryDetails(null, "wholesale", {}), []);
});
