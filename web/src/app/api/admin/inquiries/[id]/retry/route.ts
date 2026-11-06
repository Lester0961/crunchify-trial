import { inquirySchema } from "@/features/inquiries/schema";
import { database, databaseSchema } from "@/server/db";
import { sendEmails } from "@/server/email/send";
import { updateDeliveryStatus } from "@/server/email/delivery-status";
import { isAdmin } from "@/server/security/admin";
import { sameOriginUrl } from "@/server/security/request-origin";
import { isInquiryId } from "@/server/security/inquiry-id";
import {
  adminFormError,
  detailFormResponse,
} from "@/server/security/admin-response";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const url = sameOriginUrl(request);
  if (!url || !(await isAdmin()))
    return adminFormError(
      request,
      "Your session has ended. Sign in and try again.",
      403,
    );
  const { id } = await params;
  if (!isInquiryId(id))
    return adminFormError(request, "This inquiry is unavailable.", 400);
  try {
    const db = database();
    const schema = databaseSchema();
    const result = await db.query(
      `SELECT details, sender_email_status, company_email_status FROM ${schema}.inquiries WHERE id=$1`,
      [id],
    );
    if (!result.rows[0])
      return adminFormError(
        request,
        "This inquiry is no longer available.",
        404,
      );
    const row = result.rows[0];
    const data = inquirySchema.parse(row.details);
    const only = {
      sender: row.sender_email_status !== "accepted",
      company: row.company_email_status !== "accepted",
    };
    const delivery = await sendEmails(data, only);
    await updateDeliveryStatus(db, schema, id, delivery);
    const updated = await db.query<{
      sender_email_status: string;
      company_email_status: string;
    }>(
      `SELECT sender_email_status, company_email_status FROM ${schema}.inquiries WHERE id=$1`,
      [id],
    );
    const confirmed = updated.rows[0];
    if (!confirmed)
      return adminFormError(
        request,
        "This inquiry is no longer available.",
        404,
      );
    return detailFormResponse(request, url, id, "retried", {
      retried: true,
      senderEmailStatus: confirmed.sender_email_status,
      companyEmailStatus: confirmed.company_email_status,
    });
  } catch {
    console.error("Inquiry email retry failed.");
    return adminFormError(
      request,
      "We couldn’t confirm the retry. Check the delivery status before trying again.",
      503,
    );
  }
}
