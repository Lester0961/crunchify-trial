import { isAdmin } from "@/server/security/admin";
import { database, databaseSchema } from "@/server/db";
import { readLimitedBody } from "@/server/security/read-limited-body";
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
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/x-www-form-urlencoded"
  )
    return adminFormError(
      request,
      "We couldn’t read that change. Please reload the page and try again.",
      415,
    );
  let body: string | null;
  try {
    body = await readLimitedBody(request, 65536);
  } catch {
    return adminFormError(
      request,
      "We couldn’t read that change. Please try again.",
      400,
    );
  }
  if (body === null)
    return adminFormError(
      request,
      "That note is too long. Please shorten it and try again.",
      413,
    );
  const form = new URLSearchParams(body);
  const status = String(form.get("status"));
  const note = String(form.get("note") || "");
  if (!["new", "contacted", "closed"].includes(status) || note.length > 5000)
    return adminFormError(
      request,
      "Choose a valid status and keep your note within 5,000 characters.",
      400,
    );
  try {
    const result = await database().query<{
      id: string;
      status: string;
      internal_note: string | null;
    }>(
      `UPDATE ${databaseSchema()}.inquiries SET status=$2, internal_note=$3 WHERE id=$1 RETURNING id, status, internal_note`,
      [id, status, note],
    );
    const saved = result.rows[0];
    if (!saved)
      return adminFormError(
        request,
        "This inquiry is no longer available.",
        404,
      );
    return detailFormResponse(request, url, id, "saved", {
      saved: true,
      id: saved.id,
      status: saved.status,
      note: saved.internal_note || "",
    });
  } catch {
    console.error("Inquiry update failed.");
    return adminFormError(
      request,
      "We couldn’t save your changes right now. Your draft is still in the form.",
      503,
    );
  }
}
