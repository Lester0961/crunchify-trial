import { randomBytes, scryptSync } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const username = process.env.CRUNCHIFY_ADMIN_USERNAME || "admin";
if (!/^[A-Za-z0-9_.@-]{1,100}$/.test(username)) throw new Error("Use 1–100 letters, numbers, dots, underscores, hyphens or @ for the username");
const directory = process.env.CRUNCHIFY_ADMIN_SETUP_DIR || join(process.env.LOCALAPPDATA || join(homedir(), ".local", "share"), "Crunchify", "Credentials");
mkdirSync(directory, { recursive: true, mode: 0o700 });
const path = join(directory, "admin-generated.env");
const password = randomBytes(24).toString("base64url");
const salt = randomBytes(16).toString("hex");
const hash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
const secret = randomBytes(32).toString("base64url");
const contents = `ADMIN_USER=${username}\nADMIN_PASSWORD=${password}\nADMIN_PASSWORD_HASH=${hash}\nADMIN_SESSION_SECRET=${secret}\n`;
try {
  writeFileSync(path, contents, { encoding: "utf8", mode: 0o600, flag: "wx" });
} catch (error) {
  if (error?.code === "EEXIST") throw new Error("Credential file already exists; move it securely or plan a rotation before generating another");
  throw error;
}
console.log(`Credentials generated at ${path}. Restrict access using your operating system; this does not change the deployed site.`);
