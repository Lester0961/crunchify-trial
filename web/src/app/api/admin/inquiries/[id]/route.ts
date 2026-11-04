import { NextResponse } from "next/server";
import { isAdmin } from "@/server/security/admin";
import { database } from "@/server/db";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const url = new URL(request.url);
  if (request.headers.get("origin") !== url.origin || !(await isAdmin())) return new Response("Forbidden", { status: 403 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Invalid ID", { status: 400 });
  const form = await request.formData();
  const status = String(form.get("status"));
  const note = String(form.get("note") || "");
  if (!["new", "contacted", "closed"].includes(status) || note.length > 5000) return new Response("Invalid data", { status: 400 });
  await database().query("UPDATE crunchify_private.inquiries SET status=$2, internal_note=$3 WHERE id=$1", [id, status, note]);
  return NextResponse.redirect(new URL(`/admin/inquiries/${id}`, url), 303);
}
