import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT = /^scrypt\$(\d+)\$(\d+)\$(\d+)\$([A-Za-z0-9_-]+)\$([A-Za-z0-9_-]+)$/;

export function hashPassword(password: string): string {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function hashProblem(encoded: string): string | null {
  const match = SCRYPT.exec(encoded.trim());
  if (!match) {
    return "DASHBOARD_PASSWORD_HASH tidak valid. Hasilkan ulang dengan scripts/hash-dashboard-password.mjs.";
  }
  const [, n, r, p, salt, hash] = match;
  if (n !== "16384" || r !== "8" || p !== "1") {
    return "DASHBOARD_PASSWORD_HASH memakai parameter yang tidak didukung.";
  }
  if (Buffer.from(salt ?? "", "base64url").length < 16)
    return "DASHBOARD_PASSWORD_HASH tidak valid.";
  if (Buffer.from(hash ?? "", "base64url").length !== 32)
    return "DASHBOARD_PASSWORD_HASH tidak valid.";
  return null;
}

export function verifyPassword(password: string, encoded: string): boolean {
  if (hashProblem(encoded)) return false;
  const match = SCRYPT.exec(encoded.trim());
  if (!match) return false;
  const salt = Buffer.from(match[4] ?? "", "base64url");
  const expected = Buffer.from(match[5] ?? "", "base64url");
  const actual = scryptSync(password, salt, expected.length, { N: 16384, r: 8, p: 1 });
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
