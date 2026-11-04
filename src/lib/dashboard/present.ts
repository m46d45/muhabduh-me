/**
 * Hide agent bookkeeping from the page. The sheet and the stored snapshot stay
 * unchanged; only the text sent to the dashboard is cleaned.
 */

const NOISE = [
  /\(\s*lihat\b[^)]*\)/gi,
  /\(\s*draf(?:\s+[A-C])?\s+di\s+chat\s*\)/gi,
  /\bK-\d{8}-\d+\b/gi,
  /\b(?:dicatat\s+)?kopi\s+pagi\b(?:\s+\d{1,2}\s+\p{L}+\.?\s+\d{4}(?:\s+\d{1,2}[.:]\d{2})?)?/giu,
  /\bdiputuskan\s+via\s+dashboard\b.*/gi,
  /\bdicatat\s+via\s+dashboard\b.*/gi,
  /\btunda\s+sampai\s+\d{4}-\d{2}-\d{2}\b/gi,
  /\bbelum\s+terverifikasi\b/gi,
  /\bheartbeat\b/gi,
  /\bdenyut\b/gi,
  /\bPR\s*#\d+\b[^.;)\n]*/gi,
  /\bdraf\s+Red\b/gi,
  /\b[\w./-]+\.(?:md|markdown|tsx?|mjs|jsx?|json)\b/gi,
  /(?:^|[\s(])\/(?:[\w.-]+\/)+[\w.-]*/g,
];

function stripNoise(value: string): string {
  let text = value;
  for (const pattern of NOISE) {
    pattern.lastIndex = 0;
    text = text.replace(pattern, " ");
  }
  return text
    .replace(/\(\s*\)/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:?)])/g, "$1")
    .replace(/([([]\s+)/g, "$1")
    .replace(/\b(?:di|lihat|dan|yaitu|ikut)\s*$/gi, "")
    .trim();
}

function hasWords(value: string): boolean {
  return /[0-9A-Za-zÀ-ÿ]/.test(value);
}

/** Visible sentence. Empty when nothing for a person remains. */
export function presentText(value: string | null | undefined): string {
  if (!value) return "";
  const cleaned = stripNoise(value);
  const parts = cleaned
    .split(/\s*;\s*/)
    .map((part) => stripNoise(part))
    .filter(hasWords);
  return parts
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .replace(/^[,;·:\s-]+|[,;·\s]+$/g, "")
    .trim();
}

export function presentWarning(warning: string): string {
  if (/belum ada snapshot/i.test(warning)) return "Pembaruan pagi belum ada.";
  if (/lebih dari 26 jam|routine/i.test(warning)) return "Pembaruan pagi sudah lebih dari sehari.";
  if (/masih memuat data yang harus disaring/i.test(warning)) {
    return "Pembaruan pagi ditolak karena masih ada data yang harus disaring.";
  }
  if (/GOOGLE_|SHEET_|BLOB_|AUTH_SECRET|SNAPSHOT_TOKEN|service account|Kopi Pagi/i.test(warning)) {
    return "Sambungan data belum lengkap.";
  }
  return presentText(warning);
}
