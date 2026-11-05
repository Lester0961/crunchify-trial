import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { scryptSync } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmdirSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("generates usable credentials without logging them or overwriting an existing file", () => {
  const directory = mkdtempSync(join(tmpdir(), "crunchify-admin-generator-"));
  const path = join(directory, "admin-generated.env");
  try {
    const env = { ...process.env, CRUNCHIFY_ADMIN_SETUP_DIR: directory, CRUNCHIFY_ADMIN_USERNAME: "synthetic-admin" };
    const run = () => spawnSync(process.execPath, ["scripts/generate-admin-credentials.mjs"], { env, encoding: "utf8" });
    const first = run();
    assert.equal(first.status, 0);
    const contents = readFileSync(path, "utf8");
    const values = Object.fromEntries(contents.trim().split("\n").map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1)]; }));
    assert.equal(values.ADMIN_USER, "synthetic-admin");
    assert.ok(values.ADMIN_PASSWORD.length >= 24 && values.ADMIN_SESSION_SECRET.length >= 32);
    const [salt, digest] = values.ADMIN_PASSWORD_HASH.split(":");
    assert.equal(scryptSync(values.ADMIN_PASSWORD, salt, 64).toString("hex"), digest);
    assert.ok(!first.stdout.includes(values.ADMIN_PASSWORD) && !first.stderr.includes(values.ADMIN_PASSWORD));
    assert.ok(!first.stdout.includes(values.ADMIN_SESSION_SECRET) && !first.stderr.includes(values.ADMIN_SESSION_SECRET));
    const second = run();
    assert.notEqual(second.status, 0);
    assert.equal(readFileSync(path, "utf8"), contents);
  } finally {
    try { unlinkSync(path); } catch (error) { if (error?.code !== "ENOENT") throw error; }
    rmdirSync(directory);
  }
});

test("rejects usernames that could inject extra environment entries", () => {
  const directory = mkdtempSync(join(tmpdir(), "crunchify-admin-generator-"));
  try {
    const result = spawnSync(process.execPath, ["scripts/generate-admin-credentials.mjs"], { env: { ...process.env, CRUNCHIFY_ADMIN_SETUP_DIR: directory, CRUNCHIFY_ADMIN_USERNAME: "admin\nINJECTED=value" }, encoding: "utf8" });
    assert.notEqual(result.status, 0);
    assert.equal(existsSync(join(directory, "admin-generated.env")), false);
  } finally { rmdirSync(directory); }
});
