import "server-only";
import type { z } from "zod";
import { inquirySchema } from "@/features/inquiries/schema";
type Inquiry = z.infer<typeof inquirySchema>;
export async function sendEmails(data: Inquiry, only: { sender: boolean; company: boolean } = { sender: true, company: true }): Promise<{ sender: boolean; company: boolean }> {
  const { RESEND_API_KEY, MAIL_FROM, INQUIRY_NOTIFICATION_TO } = process.env;
  if (!RESEND_API_KEY || !MAIL_FROM || !INQUIRY_NOTIFICATION_TO) return { sender: false, company: false };
  const send = async (to: string, subject: string, text: string, key: string) => {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key },
        body: JSON.stringify({ from: MAIL_FROM, to: [to], subject, text }),
        signal: AbortSignal.timeout(10000),
      });
      return response.ok;
    } catch { return false; }
  };
  const [sender, company] = await Promise.all([
    only.sender ? send(data.email, "We received your Crunchify inquiry", `Hello ${data.contact},\n\nThank you for contacting Crunchify. We have received your inquiry and will be in touch.\n\nCrunchify`, `sender/${data.submissionId}`) : Promise.resolve(false),
    only.company ? send(INQUIRY_NOTIFICATION_TO, "New Crunchify inquiry", `A new ${data.type} inquiry has been received.\n\nContact: ${data.contact}\nCompany: ${data.company}\nEmail: ${data.email}\nPhone: ${data.phone}\nBusiness type: ${data.businessType}\nTerritory: ${data.territory}\nVolume: ${data.volume}\nProducts: ${data.products.join(", ")}\n\nMessage:\n${data.message}`, `company/${data.submissionId}`) : Promise.resolve(false),
  ]);
  return { sender, company };
}
