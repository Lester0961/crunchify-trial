import { NextResponse } from "next/server";
import { isAdmin } from "@/server/security/admin";
import { database } from "@/server/db";
import { readLimitedBody } from "@/server/security/read-limited-body";
import { sameOriginUrl } from "@/server/security/request-origin";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const url = sameOriginUrl(request);
  if (!url || !(await isAdmin())) return new Response("Forbidden", { status: 403 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Invalid ID", { status: 400 });
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/x-www-form-urlencoded") return new Response("Unsupported request", { status: 415 });
  let body: string | null;
  try { body = await readLimitedBody(request, 65536); } catch { return new Response("Invalid request", { status: 400 }); }
  if (body === null) return new Response("Request is too large", { status: 413 });
  const form = new URLSearchParams(body);
  const status = String(form.get("status"));
  const note = String(form.get("note") || "");
  if (!["new", "contacted", "closed"].includes(status) || note.length > 5000) return new Response("Invalid data", { status: 400 });
  await database().query("UPDATE crunchify_private.inquiries SET status=$2, internal_note=$3 WHERE id=$1", [id, status, note]);
  return NextResponse.redirect(new URL(`/admin/inquiries/${id}`, url), 303);
}
