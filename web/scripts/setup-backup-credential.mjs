import { mkdirSync, existsSync } from "node:fs";
import { once } from "node:events";
import { createInterface } from "node:readline";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const directory = process.env.CRUNCHIFY_BACKUP_DIR || join(process.env.LOCALAPPDATA, "Crunchify", "Backups");
mkdirSync(directory, { recursive: true });
const credential = join(directory, "backup-credential.dpapi");
if (existsSync(credential)) throw new Error("Backup credential already exists; do not overwrite it without a rotation plan");
if (process.stdin.isTTY) process.stdin.setRawMode(true);
const reader = createInterface({ input: process.stdin, terminal: false });
const [input] = await once(reader, "line");
if (process.stdin.isTTY) process.stdin.setRawMode(false);
reader.close();
let url;
try { url = new URL(input.trim()); } catch { throw new Error("Invalid backup connection target"); }
const localTest = process.env.CRUNCHIFY_BACKUP_TEST_MODE === "1" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
if (!localTest && (!["postgres:", "postgresql:"].includes(url.protocol) || url.pathname !== "/postgres" || url.hostname !== "aws-0-ap-southeast-1.pooler.supabase.com" || url.port !== "5432" || url.username !== "crunchify_backup_app.wnrotadxjouvnklueprl" || url.searchParams.get("sslmode") !== "verify-full")) throw new Error("Unexpected backup connection target");
const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-File", resolve("scripts/backup-dpapi.ps1"), "-Mode", "Protect", "-Path", credential], { input: Buffer.from(input.trim(), "utf8"), maxBuffer: 1024 * 1024 });
if (result.status !== 0) throw new Error("Could not protect the backup credential for this Windows user");
console.log("Backup credential protected for the current Windows user.");
