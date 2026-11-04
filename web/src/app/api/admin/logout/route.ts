import { NextResponse } from "next/server";
import { adminCookie } from "@/server/security/admin";
import { sameOriginUrl } from "@/server/security/request-origin";
export async function POST(request: Request) {
  const url = sameOriginUrl(request);
  if (!url) return new Response("Invalid request", { status: 403 });
  const response = NextResponse.redirect(new URL("/admin/login", url), 303);
  response.cookies.set(adminCookie, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "strict", secure: url.protocol === "https:" });
  return response;
}
