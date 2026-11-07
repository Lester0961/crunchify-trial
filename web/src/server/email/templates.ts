import type { z } from "zod";
import type { DisplayField } from "@/features/inquiries/display";
import type { inquirySchema } from "@/features/inquiries/schema";
import type { EmailContent } from "./brevo";

type Inquiry = z.infer<typeof inquirySchema>;

const entities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "{": "&#123;",
  "}": "&#125;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"'{}]/g, (character) => entities[character]);
}

function inquiryLabel(type: Inquiry["type"]) {
  return type === "partner" ? "Brand and media" : "Wholesale";
}

function emailLayout(label: string, heading: string, body: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#edf0e8;font-family:Arial,Helvetica,sans-serif;color:#25362d;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#edf0e8">
    <tr><td align="center" style="padding:24px 12px;">
      <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;table-layout:fixed;border:1px solid #dce4d9;">
        <tr><td bgcolor="#234b3b" style="padding:21px 24px;border-top:4px solid #f4cf62;color:#fffdf5;">
          <p style="margin:0;font-size:24px;line-height:1.2;font-weight:bold;">Crunchify</p>
          <p style="margin:5px 0 0;font-size:13px;line-height:1.5;color:#e6eee2;">Made right. Tastes right.</p>
        </td></tr>
        <tr><td bgcolor="#fffdf5" style="padding:26px 24px;color:#25362d;font-size:16px;line-height:1.55;overflow-wrap:anywhere;word-wrap:break-word;">
          <p style="margin:0 0 10px;color:#234b3b;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(label)}</p>
          <h1 style="margin:0 0 18px;font-size:28px;line-height:1.22;color:#25362d;">${escapeHtml(heading)}</h1>
          ${body}
        </td></tr>
        <tr><td bgcolor="#f1f4eb" style="padding:17px 24px;border-top:1px solid #dce4d9;color:#465b50;font-size:13px;line-height:1.5;">
          This email relates to an inquiry submitted through the Crunchify website.
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
</html>`;
}

export function inquiryConfirmation(inquiry: Inquiry): EmailContent {
  const label = inquiryLabel(inquiry.type);
  const heading = "Thank you for your inquiry";
  const followUp = "Our team will review your details and follow up by email.";
  return {
    subject: `Crunchify ${label.toLowerCase()} inquiry confirmation`,
    text: `${heading}\n\nDear ${inquiry.contact},\n\nWe have received your ${label.toLowerCase()} inquiry for ${inquiry.company}. ${followUp}\n\nKind regards,\nThe Crunchify team`,
    html: emailLayout(
      `${label} inquiry`,
      heading,
      `<p style="margin:0 0 14px;">Dear ${escapeHtml(inquiry.contact)},</p>
       <p style="margin:0 0 14px;">We have received your ${label.toLowerCase()} inquiry for <strong>${escapeHtml(inquiry.company)}</strong>.</p>
       <p style="margin:0 0 22px;">${followUp}</p>
       <p style="margin:0;">Kind regards,<br><strong>The Crunchify team</strong></p>`,
    ),
  };
}

const notificationFields = new Set([
  "contact",
  "email",
  "phone",
  "businessType",
  "territory",
  "volume",
  "products",
]);

export function inquiryNotification(
  inquiry: Inquiry,
  fields: DisplayField[],
): EmailContent {
  const heading = `New ${inquiryLabel(inquiry.type).toLowerCase()} inquiry`;
  const intro = "A new inquiry submitted through the Crunchify website is ready for review.";
  const details = [
    { label: inquiry.type === "partner" ? "Organization" : "Company", value: inquiry.company },
    ...fields.filter(({ key }) => notificationFields.has(key)),
  ];
  const detailRows = details
    .map(
      ({ label, value }) => `<tr>
        <th scope="row" width="39%" align="left" valign="top" style="padding:11px 12px;border-bottom:1px solid #e2e8dc;font-size:13px;line-height:1.45;color:#465b50;">${escapeHtml(label)}</th>
        <td valign="top" style="padding:11px 12px;border-bottom:1px solid #e2e8dc;font-size:15px;line-height:1.45;color:#25362d;overflow-wrap:anywhere;word-wrap:break-word;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("\n");
  const message = escapeHtml(inquiry.message).replace(/\r\n|\r|\n/g, "<br>");
  return {
    subject: `Crunchify | ${heading}`,
    text: `${heading}\n\n${intro}\n\n${details.map(({ label, value }) => `${label}\n${value}`).join("\n\n")}\n\nMessage\n${inquiry.message}`,
    html: emailLayout(
      "Team notification",
      heading,
      `<p style="margin:0 0 20px;">${intro}</p>
       <h2 style="margin:0 0 10px;font-size:18px;line-height:1.35;">Inquiry details</h2>
       <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="table-layout:fixed;border:1px solid #e2e8dc;">
         ${detailRows}
       </table>
       <h2 style="margin:23px 0 10px;font-size:18px;line-height:1.35;">Message</h2>
       <div style="padding:14px 16px;background-color:#f4f6ee;border-left:3px solid #f4cf62;font-size:15px;line-height:1.55;overflow-wrap:anywhere;word-wrap:break-word;">${message}</div>`,
    ),
  };
}
