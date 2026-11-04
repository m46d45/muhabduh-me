import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "@/lib/dashboard/password.server";
import { nextFailure } from "@/lib/dashboard/rate-limit";
import {
  requestIsSecure,
  sessionCookie,
  signSession,
  verifySession,
} from "@/lib/dashboard/session.server";

test("session cookie is signed and rejects tampering", () => {
  const secret = "s".repeat(32);
  const now = Date.parse("2026-11-04T00:00:00.000Z");
  const token = signSession(secret, now);
  assert.equal(verifySession(token, secret, now + 1000), true);
  assert.equal(verifySession(token, "other-secret-value-32", now + 1000), false);
  const [payload, sig] = token.split(".");
  assert.equal(verifySession(`${payload}.${sig?.slice(0, -1)}x`, secret, now + 1000), false);
  assert.equal(verifySession(token, secret, now + 8 * 24 * 60 * 60 * 1000), false);
  const secure = sessionCookie(token, true);
  assert.match(secure, /HttpOnly/);
  assert.match(secure, /Secure/);
  assert.match(secure, /SameSite=Lax/);
  assert.equal(requestIsSecure(new Request("https://www.muhabduh.id/dashboard")), true);
  assert.equal(requestIsSecure(new Request("http://127.0.0.1:8080/dashboard")), false);
});

test("password hash verifies only the original password", () => {
  const encoded = hashPassword("frase-uji-yang-cukup-panjang");
  assert.equal(verifyPassword("frase-uji-yang-cukup-panjang", encoded), true);
  assert.equal(verifyPassword("frase-lain", encoded), false);
  assert.equal(verifyPassword("frase-uji-yang-cukup-panjang", "plaintext"), false);
});

test("failed attempts slow down and then lock", () => {
  const first = nextFailure(undefined, 0);
  assert.equal(first.delayMs, 800);
  assert.equal(first.locked, false);
  let state = first.state;
  for (let i = 0; i < 6; i++) state = nextFailure(state, 1000).state;
  const eighth = nextFailure(state, 2000);
  assert.equal(eighth.state.count, 8);
  assert.equal(eighth.locked, true);
  assert.equal(eighth.delayMs, 8000);
});
