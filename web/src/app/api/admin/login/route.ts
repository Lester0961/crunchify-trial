import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  adminCookie,
  checkCredentials,
  makeSession,
} from "@/server/security/admin";
import { database, databaseSchema } from "@/server/db";
import { readLimitedBody } from "@/server/security/read-limited-body";
import { sameOriginUrl } from "@/server/security/request-origin";
import { adminFormError, wantsJson } from "@/server/security/admin-response";
export async function POST(request: Request) {
  const url = sameOriginUrl(request);
  if (!url)
    return adminFormError(
      request,
      "We couldn’t read that sign-in request. Please try again.",
      403,
    );
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/x-www-form-urlencoded"
  )
    return new Response("Unsupported request", { status: 415 });
  let body: string | null;
  try {
    body = await readLimitedBody(request, 8192);
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
  if (body === null)
    return new Response("Request is too large", { status: 413 });
  const form = new URLSearchParams(body);
  const username = String(form.get("username") || "").slice(0, 200);
  const password = String(form.get("password") || "").slice(0, 512);
  try {
    const schema = databaseSchema();
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const key = "admin:" + createHash("sha256").update(ip).digest("hex");
    const result = await database().query(
      `INSERT INTO ${schema}.rate_limits (key,count,window_start) VALUES ($1,1,now())
      ON CONFLICT (key) DO UPDATE SET count=CASE WHEN ${schema}.rate_limits.window_start < now() - interval '15 minutes' THEN 1 ELSE ${schema}.rate_limits.count+1 END,
      window_start=CASE WHEN ${schema}.rate_limits.window_start < now() - interval '15 minutes' THEN now() ELSE ${schema}.rate_limits.window_start END RETURNING count`,
      [key],
    );
    if (result.rows[0].count > 10 || !checkCredentials(username, password))
      return wantsJson(request)
        ? adminFormError(
            request,
            "Unable to sign in. Check your details and try again.",
            401,
          )
        : NextResponse.redirect(new URL("/admin/login?error=1", url), 303);
    const response = wantsJson(request)
      ? NextResponse.json(
          { signedIn: true },
          { headers: { "Cache-Control": "no-store" } },
        )
      : NextResponse.redirect(new URL("/admin", url), 303);
    response.cookies.set(adminCookie, await makeSession(), {
      httpOnly: true,
      secure: url.protocol === "https:",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60,
    });
    return response;
  } catch {
    return wantsJson(request)
      ? adminFormError(
          request,
          "We couldn’t sign you in right now. Please try again.",
          503,
        )
      : NextResponse.redirect(new URL("/admin/login?error=1", url), 303);
  }
}
