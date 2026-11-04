import { NextResponse } from "next/server";
import { adminCookie } from "@/server/security/admin";
export async function POST(request: Request) {
  const url = new URL(request.url);
  if (request.headers.get("origin") !== url.origin) return new Response("Invalid request", { status: 403 });
  const response = NextResponse.redirect(new URL("/admin/login", url), 303);
  response.cookies.set(adminCookie, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "strict", secure: url.protocol === "https:" });
  return response;
}
