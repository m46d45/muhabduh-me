import { parseDateKey } from "@/lib/dashboard/time";

/**
 * Urutan kepentingan kartu "Menunggu Bapak".
 *
 * Tenggat, prioritas pertama:
 * 1. Tanggal yang tertulis di judul (ISO, dd/mm/yyyy, atau "8 Des" / "8 Desember 2026").
 *    Beberapa tanggal: yang paling awal. Tahun yang tidak ditulis memakai tahun ini
 *    atau tahun depan, mana yang tanggalnya lebih dekat ke hari ini (WIB).
 * 2. Jika judul memuat "hari ini" dan tidak ada tanggal, tenggat = tanggal Muncul,
 *    atau hari ini bila Muncul tidak terbaca.
 * 3. Jika masih kosong, tenggat paling awal di snapshot untuk proyek yang sama.
 *
 * Label, dihitung terhadap hari ini (WIB):
 * - Mendesak: tenggat hari ini atau sudah lewat. Tanpa tenggat: kolom Lewat, kata
 *   "lewat" di judul, atau item muncul 7 hari atau lebih.
 * - Penting: tenggat 1–7 hari lagi. Tanpa tenggat: muncul 3–6 hari yang lalu.
 * - Bisa nanti: tenggat lebih dari 7 hari lagi, atau muncul 0–2 hari / tanpa tanggal.
 *
 * Urutan kartu: Mendesak, Penting, Bisa nanti. Di dalam kelompok yang sama: tenggat
 * lebih awal dulu, lalu tanggal Muncul lebih lama, lalu ID.
 */

export type Importance = "Mendesak" | "Penting" | "Bisa nanti";

export const IMPORTANCE_RANK: Record<Importance, number> = {
  Mendesak: 0,
  Penting: 1,
  "Bisa nanti": 2,
};

const MONTH_NUM: Record<string, number> = {
  januari: 1,
  jan: 1,
  februari: 2,
  feb: 2,
  maret: 3,
  mar: 3,
  april: 4,
  apr: 4,
  mei: 5,
  juni: 6,
  jun: 6,
  juli: 7,
  jul: 7,
  agustus: 8,
  agu: 8,
  agt: 8,
  september: 9,
  sept: 9,
  sep: 9,
  oktober: 10,
  okt: 10,
  november: 11,
  nov: 11,
  desember: 12,
  des: 12,
};

const MONTH =
  "januari|februari|maret|april|agustus|september|oktober|november|desember|jan|feb|mar|apr|agu|agt|sept|sep|juni|juli|jun|jul|mei|okt|nov|des";

export type DeadlineHint = { proyek: string | null; jatuhTempo: string | null };

function daysBetween(from: string, to: string): number {
  const [y1, m1, d1] = from.split("-").map(Number);
  const [y2, m2, d2] = to.split("-").map(Number);
  const start = Date.UTC(y1 ?? 0, (m1 ?? 1) - 1, d1 ?? 1);
  const end = Date.UTC(y2 ?? 0, (m2 ?? 1) - 1, d2 ?? 1);
  return Math.round((end - start) / 86_400_000);
}

function dateKey(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function closestYear(month: number, day: number, anchor: string): string | null {
  const year = Number(anchor.slice(0, 4));
  if (!Number.isFinite(year)) return null;
  const thisYear = dateKey(year, month, day);
  const nextYear = dateKey(year + 1, month, day);
  if (!thisYear) return nextYear;
  if (!nextYear) return thisYear;
  return Math.abs(daysBetween(anchor, thisYear)) <= Math.abs(daysBetween(anchor, nextYear))
    ? thisYear
    : nextYear;
}

function pushDate(found: Set<string>, key: string | null) {
  if (key) found.add(key);
}

/** Every concrete date in a decision title. Earliest wins later. */
export function datesInText(text: string, anchor: string): string[] {
  const found = new Set<string>();
  const source = text.normalize("NFKC");
  for (const match of source.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)) {
    pushDate(found, dateKey(Number(match[1]), Number(match[2]), Number(match[3])));
  }
  for (const match of source.matchAll(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/g)) {
    pushDate(found, dateKey(Number(match[3]), Number(match[2]), Number(match[1])));
  }
  const named = new RegExp(
    `\\b(\\d{1,2})(?:\\s*[\\u2013-]\\s*\\d{1,2})?\\s+(${MONTH})\\b(?:\\s+(\\d{4}))?`,
    "gi",
  );
  for (const match of source.matchAll(named)) {
    const month = MONTH_NUM[(match[2] ?? "").toLowerCase()];
    if (!month) continue;
    const year = match[3] ? Number(match[3]) : null;
    pushDate(
      found,
      year ? dateKey(year, month, Number(match[1])) : closestYear(month, Number(match[1]), anchor),
    );
  }
  const pair = new RegExp(
    `\\b(\\d{1,2})\\s+atau\\s+(\\d{1,2})\\s+(${MONTH})\\b(?:\\s+(\\d{4}))?`,
    "gi",
  );
  for (const match of source.matchAll(pair)) {
    const month = MONTH_NUM[(match[3] ?? "").toLowerCase()];
    if (!month) continue;
    const year = match[4] ? Number(match[4]) : null;
    for (const day of [Number(match[1]), Number(match[2])]) {
      pushDate(found, year ? dateKey(year, month, day) : closestYear(month, day, anchor));
    }
  }
  return [...found].sort();
}

function parseFlexibleDate(value: string, anchor: string): string | null {
  const direct = parseDateKey(value);
  if (direct) return direct;
  if (!anchor) return null;
  return datesInText(value, anchor)[0] ?? null;
}

export function resolveDueDate(args: {
  pertanyaan: string;
  muncul: string;
  proyek: string;
  today: string;
  tenggat: DeadlineHint[];
}): string | null {
  const anchor = parseDateKey(args.today) ?? parseDateKey(args.muncul) ?? "";
  const muncul = parseFlexibleDate(args.muncul, anchor);
  if (anchor) {
    const dated = datesInText(args.pertanyaan, anchor);
    if (dated[0]) return dated[0];
  }
  if (/\bhari ini\b/i.test(args.pertanyaan)) {
    if (muncul) return muncul;
    if (parseDateKey(args.today)) return args.today;
  }
  const proyek = args.proyek.trim().toLowerCase();
  if (!proyek) return null;
  const matches = args.tenggat
    .flatMap((item) => {
      const name = (item.proyek ?? "").trim().toLowerCase();
      const due = item.jatuhTempo ? parseDateKey(item.jatuhTempo) : null;
      return name === proyek && due ? [due] : [];
    })
    .sort();
  return matches[0] ?? null;
}

export function decisionImportance(args: {
  pertanyaan: string;
  muncul: string;
  proyek: string;
  lewat: boolean;
  today: string;
  tenggat: DeadlineHint[];
}): { penting: Importance; tenggat: string | null } {
  const due = resolveDueDate(args);
  const today = parseDateKey(args.today);
  if (!today) return { penting: "Bisa nanti", tenggat: due };
  if (due) {
    const delta = daysBetween(today, due);
    if (delta <= 0) return { penting: "Mendesak", tenggat: due };
    if (delta <= 7) return { penting: "Penting", tenggat: due };
    return { penting: "Bisa nanti", tenggat: due };
  }
  if (args.lewat || /\blewat\b/i.test(args.pertanyaan)) {
    return { penting: "Mendesak", tenggat: null };
  }
  const muncul = parseFlexibleDate(args.muncul, today);
  if (muncul) {
    const age = daysBetween(muncul, today);
    if (age >= 7) return { penting: "Mendesak", tenggat: null };
    if (age >= 3) return { penting: "Penting", tenggat: null };
  }
  return { penting: "Bisa nanti", tenggat: null };
}

export function compareDecisions<
  T extends { penting: Importance; tenggat: string | null; muncul: string; id: string },
>(a: T, b: T): number {
  const rank = IMPORTANCE_RANK[a.penting] - IMPORTANCE_RANK[b.penting];
  if (rank !== 0) return rank;
  const due = (a.tenggat ?? "9999-99-99").localeCompare(b.tenggat ?? "9999-99-99");
  if (due !== 0) return due;
  const anchor = a.tenggat ?? b.tenggat ?? "2026-06-01";
  const muncul = (parseFlexibleDate(a.muncul, anchor) ?? "9999-99-99").localeCompare(
    parseFlexibleDate(b.muncul, anchor) ?? "9999-99-99",
  );
  if (muncul !== 0) return muncul;
  return a.id.localeCompare(b.id, "id");
}
