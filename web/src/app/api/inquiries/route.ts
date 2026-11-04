import { createHash } from "node:crypto";
import { inquirySchema } from "@/features/inquiries/schema";
import { database } from "@/server/db";
import { sendEmails } from "@/server/email/send";
import { readLimitedBody } from "@/server/security/read-limited-body";

export async function POST(request: Request) {
  let input: unknown;
  try {
    const body = await readLimitedBody(request, 20000);
    if (body === null) return Response.json({ error: "Request is too large." }, { status: 413 });
    input = JSON.parse(body);
  } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) return Response.json({ error: "Please check your entries and try again.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const data = parsed.data;
  try {
    const db = database();
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const key = createHash("sha256").update(ip).digest("hex");
    const limit = await db.query(`INSERT INTO crunchify_private.rate_limits (key,count,window_start) VALUES ($1,1,now())
      ON CONFLICT (key) DO UPDATE SET count = CASE WHEN crunchify_private.rate_limits.window_start < now() - interval '1 hour' THEN 1 ELSE crunchify_private.rate_limits.count + 1 END,
      window_start = CASE WHEN crunchify_private.rate_limits.window_start < now() - interval '1 hour' THEN now() ELSE crunchify_private.rate_limits.window_start END RETURNING count`, [key]);
    if (limit.rows[0].count > 10) return Response.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    const saved = await db.query("INSERT INTO crunchify_private.inquiries (id,kind,details) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING RETURNING id", [data.submissionId, data.type, JSON.stringify(data)]);
    if (saved.rowCount) {
      const delivery = await sendEmails(data);
      await db.query("UPDATE crunchify_private.inquiries SET sender_email_status=$2, company_email_status=$3 WHERE id=$1", [data.submissionId, delivery.sender ? "accepted" : "failed", delivery.company ? "accepted" : "failed"]);
    }
    const existing = await db.query("SELECT details = $2::jsonb AS same_content, sender_email_status, company_email_status FROM crunchify_private.inquiries WHERE id=$1", [data.submissionId, JSON.stringify(data)]);
    if (!existing.rows[0]?.same_content) return Response.json({ error: "Your previous attempt was saved with different details. Please submit the updated inquiry again." }, { status: 409 });
    const result = existing.rows[0];
    return Response.json({ ok: true, notificationPending: result.sender_email_status !== "accepted" || result.company_email_status !== "accepted" });
  } catch { return Response.json({ error: "We couldn’t send your inquiry. Please try again later." }, { status: 503 }); }
}
