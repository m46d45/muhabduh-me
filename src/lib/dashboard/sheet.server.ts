import { createSign } from "node:crypto";
import type { CellUpdate } from "@/lib/dashboard/decisions";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export class SheetConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SheetConfigError";
  }
}

export function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n");
}

export function sheetConfig():
  | { ok: true; email: string; key: string; sheetId: string; tab: string }
  | { ok: false; error: string } {
  const email = process.env.GOOGLE_SA_EMAIL?.trim() ?? "";
  const keyRaw = process.env.GOOGLE_SA_PRIVATE_KEY?.trim() ?? "";
  const sheetId = process.env.SHEET_ID?.trim() ?? "";
  const tab = process.env.SHEET_TAB?.trim() || "Keputusan";
  if (!email || !keyRaw || !sheetId) {
    return {
      ok: false,
      error:
        "Koneksi Google Sheet belum lengkap. Atur GOOGLE_SA_EMAIL, GOOGLE_SA_PRIVATE_KEY, dan SHEET_ID.",
    };
  }
  const key = normalizePrivateKey(keyRaw);
  if (!key.includes("BEGIN PRIVATE KEY") && !key.includes("BEGIN RSA PRIVATE KEY")) {
    return { ok: false, error: "GOOGLE_SA_PRIVATE_KEY bukan kunci PEM service account." };
  }
  return { ok: true, email, key, sheetId, tab };
}

function base64url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

export function signServiceJwt(
  email: string,
  privateKey: string,
  nowSec = Math.floor(Date.now() / 1000),
): string {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: email,
      scope: SHEETS_SCOPE,
      aud: TOKEN_URL,
      iat: nowSec,
      exp: nowSec + 3600,
    }),
  );
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(privateKey).toString("base64url");
  return `${unsigned}.${signature}`;
}

let tokenCache: { token: string; expMs: number; key: string } | null = null;

export function clearGoogleTokenCache(): void {
  tokenCache = null;
}

async function accessToken(email: string, privateKey: string): Promise<string> {
  const cacheKey = `${email}:${privateKey.slice(-24)}`;
  if (tokenCache && tokenCache.key === cacheKey && tokenCache.expMs - 60_000 > Date.now()) {
    return tokenCache.token;
  }
  const assertion = signServiceJwt(email, privateKey);
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new SheetConfigError(
      "Google menolak service account. Periksa GOOGLE_SA_EMAIL dan GOOGLE_SA_PRIVATE_KEY.",
    );
  }
  const body = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!body.access_token) {
    throw new SheetConfigError("Google tidak mengembalikan token akses.");
  }
  tokenCache = {
    token: body.access_token,
    expMs: Date.now() + (body.expires_in ?? 3600) * 1000,
    key: cacheKey,
  };
  return body.access_token;
}

function sheetError(status: number): string {
  if (status === 403 || status === 401) {
    return "Service account belum diundang sebagai Editor pada Sheet. Bagikan file itu ke email service account.";
  }
  if (status === 404) return "SHEET_ID tidak ditemukan, atau nama tab salah (SHEET_TAB).";
  return "Google Sheet tidak bisa dihubungi.";
}

let gridCache: { key: string; at: number; values: string[][] } | null = null;

export function clearSheetCache(): void {
  gridCache = null;
}

export async function readSheetValues(options?: { fresh?: boolean }): Promise<{
  values: string[][];
  tab: string;
  sheetId: string;
}> {
  const config = sheetConfig();
  if (!config.ok) throw new SheetConfigError(config.error);
  const cacheKey = `${config.sheetId}:${config.tab}`;
  if (
    !options?.fresh &&
    gridCache &&
    gridCache.key === cacheKey &&
    Date.now() - gridCache.at < 60_000
  ) {
    return { values: gridCache.values, tab: config.tab, sheetId: config.sheetId };
  }
  const token = await accessToken(config.email, config.key);
  const range = encodeURIComponent(`${config.tab}!A1:ZZ2000`);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.sheetId)}/values/${range}`,
    {
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!response.ok) throw new SheetConfigError(sheetError(response.status));
  const body = (await response.json()) as { values?: unknown[][] };
  const values = (body.values ?? []).map((row) => row.map((cell) => String(cell ?? "")));
  gridCache = { key: cacheKey, at: Date.now(), values };
  return { values, tab: config.tab, sheetId: config.sheetId };
}

export async function writeSheetCells(updates: CellUpdate[]): Promise<void> {
  const config = sheetConfig();
  if (!config.ok) throw new SheetConfigError(config.error);
  const token = await accessToken(config.email, config.key);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.sheetId)}/values:batchUpdate`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        valueInputOption: "RAW",
        data: updates,
      }),
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!response.ok) throw new SheetConfigError(sheetError(response.status));
  clearSheetCache();
}

export function sheetEditUrl(sheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/edit`;
}
