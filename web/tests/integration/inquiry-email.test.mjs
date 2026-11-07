import assert from "node:assert/strict";
import test from "node:test";
import { formatInquiryDetails } from "../../src/features/inquiries/display.ts";
import { inquiryConfirmation, inquiryNotification } from "../../src/server/email/templates.ts";

const inquiry = {
  type: "wholesale",
  company: "Market & Co.",
  contact: "Lina <buyer>",
  email: "buyer@example.invalid",
  phone: "0000000000",
  businessType: "Retailer",
  territory: "Manila",
  volume: "100 packs",
  products: ["banana-crunch"],
  message: 'Please send details.\r\n<img src="https://example.invalid"> {{ contact.EMAIL }}',
  utm: { utm_source: "internal-test" },
};

test("renders escaped wholesale details and keeps a readable plain text fallback", () => {
  const fields = formatInquiryDetails(inquiry, inquiry.type, { "banana-crunch": "Banana Crunch" });
  const confirmation = inquiryConfirmation(inquiry);
  const notification = inquiryNotification(inquiry, fields);

  assert.match(confirmation.html, /Lina &lt;buyer&gt;/);
  assert.match(confirmation.html, /Market &amp; Co\./);
  assert.doesNotMatch(confirmation.html, /buyer@example\.invalid|Please send details/);
  assert.match(notification.html, /Banana Crunch/);
  assert.match(notification.html, /Please send details\.<br>&lt;img src=&quot;/);
  assert.doesNotMatch(notification.html, /<img|\{\{ contact\.EMAIL \}\}|internal-test/);
  assert.match(notification.text, /Products of interest\nBanana Crunch/);
  assert.ok(notification.text.includes(inquiry.message));
});

test("labels a partner inquiry by collaboration and omits empty wholesale fields", () => {
  const partner = {
    ...inquiry,
    type: "partner",
    businessType: "Media collaboration",
    phone: "",
    territory: "",
    volume: "",
    products: [],
  };
  const confirmation = inquiryConfirmation(partner);
  const notification = inquiryNotification(partner, formatInquiryDetails(partner, partner.type, {}));

  assert.match(confirmation.subject, /brand and media/i);
  assert.match(notification.html, /Collaboration type/);
  assert.match(notification.html, /Media collaboration/);
  assert.doesNotMatch(notification.html, /Phone or WhatsApp|Estimated monthly volume|Products of interest/);
});
