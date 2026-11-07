import "server-only";
import type { z } from "zod";
import { formatInquiryDetails } from "@/features/inquiries/display";
import type { inquirySchema } from "@/features/inquiries/schema";
import { products } from "@/features/products/data";
import { deliverBrevo, type EmailContent } from "./brevo";
import { inquiryConfirmation, inquiryNotification } from "./templates";

type Inquiry = z.infer<typeof inquirySchema>;
const productNames = Object.fromEntries(
  products.map(({ slug, name }) => [slug, name]),
);

export async function sendEmails(
  data: Inquiry,
  only: { sender: boolean; company: boolean } = { sender: true, company: true },
): Promise<{ sender: boolean; company: boolean }> {
  const { BREVO_API_KEY, MAIL_FROM, INQUIRY_NOTIFICATION_TO } = process.env;
  if (!BREVO_API_KEY || !MAIL_FROM || !INQUIRY_NOTIFICATION_TO) {
    return { sender: false, company: false };
  }
  const send = (to: string, content: EmailContent, key: string) =>
    deliverBrevo({ apiKey: BREVO_API_KEY, from: MAIL_FROM, to, ...content, key });

  const [sender, company] = await Promise.all([
    only.sender
      ? send(data.email, inquiryConfirmation(data), `sender/${data.submissionId}`)
      : false,
    only.company
      ? send(
          INQUIRY_NOTIFICATION_TO,
          inquiryNotification(
            data,
            formatInquiryDetails(data, data.type, productNames),
          ),
          `company/${data.submissionId}`,
        )
      : false,
  ]);
  return { sender, company };
}
