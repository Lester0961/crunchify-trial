import { createHash } from "node:crypto";

type Mail = { apiKey: string; from: string; to: string; subject: string; text: string; key: string };

/** A provider acceptance is not a delivery receipt. Network failures can be ambiguous. */
export async function deliverBrevo(mail: Mail, request: typeof fetch = fetch): Promise<boolean> {
  const hash = createHash("sha256").update(mail.key).digest("hex");
  const idempotencyKey = `${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
  try {
    const response = await request("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": mail.apiKey, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ sender: { name: "Crunchify", email: mail.from }, to: [{ email: mail.to }], subject: mail.subject, textContent: mail.text, headers: { idempotencyKey } }),
      signal: AbortSignal.timeout(10000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
