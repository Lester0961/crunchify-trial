import "server-only";
import type { z } from "zod";
import { inquirySchema } from "@/features/inquiries/schema";
import { deliverBrevo } from "./brevo";
type Inquiry = z.infer<typeof inquirySchema>;
export async function sendEmails(data: Inquiry, only: { sender: boolean; company: boolean } = { sender: true, company: true }): Promise<{ sender: boolean; company: boolean }> {
  const { BREVO_API_KEY, MAIL_FROM, INQUIRY_NOTIFICATION_TO } = process.env;
  if (!BREVO_API_KEY || !MAIL_FROM || !INQUIRY_NOTIFICATION_TO) return { sender: false, company: false };
  const send = async (to: string, subject: string, text: string, key: string) => {
    return deliverBrevo({ apiKey: BREVO_API_KEY, from: MAIL_FROM, to, subject, text, key });
  };
  const [sender, company] = await Promise.all([
    only.sender ? send(data.email, "We received your Crunchify inquiry", `Hello ${data.contact},\n\nThank you for contacting Crunchify. We have received your inquiry and will be in touch.\n\nCrunchify`, `sender/${data.submissionId}`) : Promise.resolve(false),
    only.company ? send(INQUIRY_NOTIFICATION_TO, "New Crunchify inquiry", `A new ${data.type} inquiry has been received.\n\nContact: ${data.contact}\nCompany: ${data.company}\nEmail: ${data.email}\nPhone: ${data.phone}\nBusiness type: ${data.businessType}\nTerritory: ${data.territory}\nVolume: ${data.volume}\nProducts: ${data.products.join(", ")}\n\nMessage:\n${data.message}`, `company/${data.submissionId}`) : Promise.resolve(false),
  ]);
  return { sender, company };
}
