import "server-only";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const COOKIE = "crunchify_admin";
function equal(a: string, b: string) {
  const x = Buffer.from(a); const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function checkCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USER;
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUser || !stored || !process.env.ADMIN_SESSION_SECRET) return false;
  const [salt, expected] = stored.split(":");
  if (!salt || !expected || !/^[0-9a-f]{128}$/.test(expected)) return false;
  const derived = scryptSync(password, salt, 64).toString("hex");
  return equal(username, expectedUser) && equal(derived, expected);
}
function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return "";
  return createHmac("sha256", secret).update(value).digest("hex");
}
export function makeSession() {
  const value = String(Date.now() + 8 * 60 * 60 * 1000);
  return `${value}.${sign(value)}`;
}
export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  const expected = sign(expiry || "");
  return Boolean(expected && signature && Number(expiry) > Date.now() && equal(signature, expected));
}
export const adminCookie = COOKIE;
