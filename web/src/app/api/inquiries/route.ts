import { createHash } from "node:crypto";
import { inquirySchema } from "@/features/inquiries/schema";
import { database, databaseSchema } from "@/server/db";
import { sendEmails } from "@/server/email/send";
import { updateDeliveryStatus } from "@/server/email/delivery-status";
import { readLimitedBody } from "@/server/security/read-limited-body";

export async function POST(request: Request) {
  let input: unknown;
  try {
    const body = await readLimitedBody(request, 20000);
    if (body === null) {
      return Response.json({ error: "Request is too large." }, { status: 413 });
    }
    input = JSON.parse(body);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Please check your entries and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  try {
    const db = database();
    const schema = databaseSchema();
    const ipAddress =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const rateLimitKey = createHash("sha256").update(ipAddress).digest("hex");
    const attempts = await db.query<{ count: number }>(
      `INSERT INTO ${schema}.rate_limits (key, count, window_start)
       VALUES ($1, 1, now())
       ON CONFLICT (key) DO UPDATE SET
         count = CASE
           WHEN ${schema}.rate_limits.window_start < now() - interval '1 hour' THEN 1
           ELSE ${schema}.rate_limits.count + 1
         END,
         window_start = CASE
           WHEN ${schema}.rate_limits.window_start < now() - interval '1 hour' THEN now()
           ELSE ${schema}.rate_limits.window_start
         END
       RETURNING count`,
      [rateLimitKey],
    );
    if (attempts.rows[0].count > 10) {
      return Response.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 },
      );
    }

    const inserted = await db.query(
      `INSERT INTO ${schema}.inquiries (id, kind, details)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING
       RETURNING id`,
      [data.submissionId, data.type, JSON.stringify(data)],
    );
    if (inserted.rowCount) {
      const delivery = await sendEmails(data);
      await updateDeliveryStatus(db, schema, data.submissionId, delivery);
    }

    const existing = await db.query<{
      same_content: boolean;
      sender_email_status: string;
      company_email_status: string;
    }>(
      `SELECT details = $2::jsonb AS same_content,
              sender_email_status, company_email_status
       FROM ${schema}.inquiries
       WHERE id = $1`,
      [data.submissionId, JSON.stringify(data)],
    );
    const savedInquiry = existing.rows[0];
    if (!savedInquiry?.same_content) {
      return Response.json(
        {
          error: "Your previous attempt was saved with different details. Please submit the updated inquiry again.",
        },
        { status: 409 },
      );
    }
    return Response.json({
      ok: true,
      notificationPending:
        savedInquiry.sender_email_status !== "accepted" ||
        savedInquiry.company_email_status !== "accepted",
    });
  } catch {
    return Response.json(
      { error: "We couldn’t send your inquiry. Please try again later." },
      { status: 503 },
    );
  }
}
