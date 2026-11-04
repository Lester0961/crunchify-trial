import { NextResponse } from "next/server";
import { adminCookie, revokeSession } from "@/server/security/admin";
import { sameOriginUrl } from "@/server/security/request-origin";
export async function POST(request: Request) {
  const url = sameOriginUrl(request);
  if (!url) return new Response("Invalid request", { status: 403 });
  let response;
  try {
    await revokeSession();
    response = NextResponse.redirect(new URL("/admin/login", url), 303);
  } catch {
    return new NextResponse("Sign-out could not be completed. Please try again.", { status: 503 });
  }
  response.cookies.set(adminCookie, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "strict", secure: url.protocol === "https:" });
  return response;
}
