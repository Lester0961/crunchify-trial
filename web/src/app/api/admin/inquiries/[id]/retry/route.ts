import { NextResponse } from "next/server";
import { inquirySchema } from "@/features/inquiries/schema";
import { database } from "@/server/db";
import { sendEmails } from "@/server/email/send";
import { isAdmin } from "@/server/security/admin";
import { sameOriginUrl } from "@/server/security/request-origin";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const url = sameOriginUrl(request);
  if (!url || !(await isAdmin())) return new Response("Forbidden", { status: 403 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Invalid ID", { status: 400 });
  const db = database();
  const result = await db.query("SELECT details, sender_email_status, company_email_status FROM crunchify_private.inquiries WHERE id=$1", [id]);
  if (!result.rows[0]) return new Response("Not found", { status: 404 });
  const row = result.rows[0];
  const data = inquirySchema.parse(row.details);
  const only = { sender: row.sender_email_status !== "accepted", company: row.company_email_status !== "accepted" };
  const delivery = await sendEmails(data, only);
  await db.query("UPDATE crunchify_private.inquiries SET sender_email_status=$2, company_email_status=$3 WHERE id=$1", [id, row.sender_email_status === "accepted" || delivery.sender ? "accepted" : "failed", row.company_email_status === "accepted" || delivery.company ? "accepted" : "failed"]);
  return NextResponse.redirect(new URL(`/admin/inquiries/${id}`, url), 303);
}
