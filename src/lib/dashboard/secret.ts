/**
 * Client-confidentiality filter for the private dashboard.
 * Keywords are matched before anything is stored or sent to the browser.
 * IDR is matched as its own token so ordinary words are left alone.
 */

const IDR_TOKEN = /(?:^|[^a-z])idr(?=[^a-z]|$)/;

export function containsSecret(value: string): boolean {
  const lower = value.toLowerCase();
  if (lower.includes("inpex") || lower.includes("masela") || lower.includes("olng")) {
    return true;
  }
  return IDR_TOKEN.test(lower);
}

export function containsSecretDeep(value: unknown): boolean {
  if (typeof value === "string") return containsSecret(value);
  if (Array.isArray(value)) return value.some((item) => containsSecretDeep(item));
  if (value && typeof value === "object") {
    return Object.values(value).some((item) => containsSecretDeep(item));
  }
  return false;
}

export const REDACTED_MEETING = "Rapat klien (rahasia)";
export const REDACTED_DEADLINE = "Tenggat klien (rahasia)";
export const REDACTED_PROJECT = "Proyek klien (rahasia)";
export const REDACTED_QUESTION = "Pertanyaan klien (rahasia)";
