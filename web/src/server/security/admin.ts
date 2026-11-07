import "server-only";
import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { database, databaseSchema } from "@/server/db";

const COOKIE = "crunchify_admin";

function sameValue(candidate: string, expected: string) {
  const candidateBytes = Buffer.from(candidate);
  const expectedBytes = Buffer.from(expected);
  return (
    candidateBytes.length === expectedBytes.length &&
    timingSafeEqual(candidateBytes, expectedBytes)
  );
}

export function checkCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USER;
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUser || !stored || !process.env.ADMIN_SESSION_SECRET) return false;
  const [salt, expected] = stored.split(":");
  if (!salt || !expected || !/^[0-9a-f]{128}$/.test(expected)) return false;
  const derived = scryptSync(password, salt, 64).toString("hex");
  return sameValue(username, expectedUser) && sameValue(derived, expected);
}

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

function hash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function makeSession() {
  const expires = Date.now() + 8 * 60 * 60 * 1000;
  const value = `${expires}.${randomBytes(32).toString("hex")}`;
  const signature = sign(value);
  if (!signature) throw new Error("Admin session secret is not configured");
  const token = `${value}.${signature}`;
  const db = database();
  const schema = databaseSchema();
  await db.query(`DELETE FROM ${schema}.admin_sessions WHERE expires_at < now()`);
  await db.query(
    `INSERT INTO ${schema}.admin_sessions (token_hash, expires_at) VALUES ($1, $2)`,
    [hash(token), new Date(expires)],
  );
  return token;
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [expiry, nonce, signature, extra] = token.split(".");
  if (
    extra ||
    !/^\d{13}$/.test(expiry || "") ||
    !/^[0-9a-f]{64}$/.test(nonce || "") ||
    !/^[0-9a-f]{64}$/.test(signature || "")
  ) {
    return false;
  }
  const expected = sign(`${expiry}.${nonce}`);
  if (!expected || Number(expiry) <= Date.now() || !sameValue(signature, expected)) {
    return false;
  }
  const result = await database().query(
    `SELECT 1 FROM ${databaseSchema()}.admin_sessions WHERE token_hash=$1 AND expires_at > now()`,
    [hash(token)],
  );
  return result.rowCount === 1;
}

export async function revokeSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (token && token.length <= 256) {
    await database().query(
      `DELETE FROM ${databaseSchema()}.admin_sessions WHERE token_hash=$1`,
      [hash(token)],
    );
  }
}

export const adminCookie = COOKIE;
