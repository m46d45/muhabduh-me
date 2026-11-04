import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "dashboard_session";
export const SESSION_MAX_AGE_SEC = 7 * 24 * 60 * 60;

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function signSession(secret: string, now = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({ v: 1, exp: now + SESSION_MAX_AGE_SEC * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySession(token: string, secret: string, now = Date.now()): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  if (!payload || !sig) return false;
  const expected = sign(payload, secret);
  const actualBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (actualBuf.length !== expectedBuf.length) return false;
  if (!timingSafeEqual(actualBuf, expectedBuf)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      v?: unknown;
      exp?: unknown;
    };
    return data.v === 1 && typeof data.exp === "number" && data.exp > now;
  } catch {
    return false;
  }
}

export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey === name) return rest.join("=");
  }
  return null;
}

export function requestIsSecure(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0]?.trim() === "https";
  return new URL(request.url).protocol === "https:";
}

export function sessionCookie(
  value: string,
  secure: boolean,
  maxAge = SESSION_MAX_AGE_SEC,
): string {
  const parts = [
    `${SESSION_COOKIE}=${value}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
