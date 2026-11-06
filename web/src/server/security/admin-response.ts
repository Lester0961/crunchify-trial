import "server-only";
import { NextResponse } from "next/server";

export const wantsJson = (request: Request) =>
  request.headers.get("accept")?.includes("application/json") === true;

export function adminFormError(
  request: Request,
  message: string,
  status: number,
) {
  return wantsJson(request)
    ? NextResponse.json(
        { error: message },
        { status, headers: { "Cache-Control": "no-store" } },
      )
    : new Response(message, { status });
}

export function detailFormResponse(
  request: Request,
  url: URL,
  id: string,
  notice: "saved" | "retried",
  data: Record<string, unknown>,
) {
  if (wantsJson(request))
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  const destination = new URL(`/admin/inquiries/${id}`, url);
  destination.searchParams.set(notice, "1");
  const back = new URL(request.url).searchParams.get("returnTo");
  if (back === "/admin" || back?.startsWith("/admin?"))
    destination.searchParams.set("returnTo", back);
  return NextResponse.redirect(destination, 303);
}
