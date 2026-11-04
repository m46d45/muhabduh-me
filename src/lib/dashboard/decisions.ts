import { REDACTED_PROJECT, REDACTED_QUESTION, containsSecret } from "@/lib/dashboard/secret";
import { withCompletion } from "@/lib/dashboard/time";

export type ColumnKey =
  | "id"
  | "keputusan"
  | "waktu"
  | "catatan"
  | "pertanyaan"
  | "proyek"
  | "sumber"
  | "opsi"
  | "lewat"
  | "tautan"
  | "muncul";

export type ColumnMap = Record<ColumnKey, number | null>;

const ALIASES: Record<ColumnKey, string[]> = {
  id: ["id", "kode", "kode keputusan", "no id"],
  keputusan: ["keputusan", "decision"],
  waktu: ["waktu wib", "waktu"],
  catatan: ["tanggapan saya", "tanggapan", "catatan", "komentar", "comment", "notes", "note"],
  pertanyaan: [
    "judul",
    "pertanyaan",
    "question",
    "uraian",
    "deskripsi",
    "isu",
    "topik",
    "hal",
    "q",
  ],
  proyek: ["proyek", "project", "nama proyek"],
  sumber: ["sumber", "source"],
  opsi: ["opsi keputusan", "opsi", "pilihan", "alternatif", "options"],
  lewat: ["lewat", "overdue", "terlambat"],
  tautan: ["tautan", "link", "url"],
  muncul: ["muncul"],
};

export function normalizeHeader(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[_./-]+/g, " ")
    .replace(/\s+/g, " ");
}

export function mapHeaders(headers: string[]): {
  map: ColumnMap;
  names: Record<ColumnKey, string | null>;
} {
  const normalized = headers.map(normalizeHeader);
  const used = new Set<number>();
  const map = {} as ColumnMap;
  const names = {} as Record<ColumnKey, string | null>;
  const keys = Object.keys(ALIASES) as ColumnKey[];

  for (const key of keys) {
    const index = normalized.findIndex(
      (header, column) => !used.has(column) && ALIASES[key].includes(header),
    );
    map[key] = index >= 0 ? index : null;
    names[key] = index >= 0 ? (headers[index]?.trim() ?? null) : null;
    if (index >= 0) used.add(index);
  }

  for (const key of keys) {
    if (map[key] != null) continue;
    const aliases = ALIASES[key]
      .filter((alias) => alias.length >= 4)
      .sort((a, b) => b.length - a.length);
    let index = -1;
    for (const alias of aliases) {
      index = normalized.findIndex((header, column) => !used.has(column) && header.includes(alias));
      if (index >= 0) break;
    }
    if (index >= 0) {
      used.add(index);
      map[key] = index;
      names[key] = headers[index]?.trim() ?? null;
    }
  }
  return { map, names };
}

export function columnLetter(index: number): string {
  let n = index + 1;
  let letters = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

export function sheetA1(tab: string, column: number, row: number): string {
  const quoted = `'${tab.replaceAll("'", "''")}'`;
  return `${quoted}!${columnLetter(column)}${row}`;
}

function cell(row: string[], index: number | null): string {
  if (index == null) return "";
  return (row[index] ?? "").trim();
}

/** Kopi Pagi: open only when both Keputusan and Waktu WIB are empty. */
export function isDecisionOpen(keputusan: string, waktu: string): boolean {
  return keputusan.trim() === "" && waktu.trim() === "";
}

export const FALLBACK_OPTIONS = ["Setuju", "Tolak", "Tunda"] as const;

function capitalizeOption(value: string): string {
  const trimmed = value
    .replace(/^(?:[-*•]|\d+[.)]|[A-Za-z][.)])\s+/, "")
    .replace(/[?.!]+$/g, "")
    .trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function looksLikeOptionList(text: string): boolean {
  return /,\s*\S.*\satau\s+\S/i.test(text);
}

function splitOptionClause(clause: string): string[] {
  const unique: string[] = [];
  for (const part of clause.split(/\s*,\s*atau\s+|\s+atau\s+|\s*,\s*/i)) {
    const option = capitalizeOption(part);
    if (!option || option.length > 160 || unique.includes(option)) continue;
    unique.push(option);
    if (unique.length === 8) break;
  }
  return unique;
}

/** Options live in the Judul text. The sheet has no options column. */
export function parseQuestionOptions(question: string): string[] {
  const text = question.trim();
  if (!text) return [...FALLBACK_OPTIONS];
  const semicolon = text.lastIndexOf(";");
  const colon = text.lastIndexOf(":");
  const separator = Math.max(semicolon, colon);
  const clause = separator >= 0 ? text.slice(separator + 1) : text;
  const parsed = separator >= 0 || looksLikeOptionList(text) ? splitOptionClause(clause) : [];
  return parsed.length >= 2 ? parsed : [...FALLBACK_OPTIONS];
}

function truthy(value: string): boolean {
  return /^(ya|yes|true|1|lewat|terlambat)$/i.test(value.trim());
}

export type SheetDecision = {
  id: string;
  rowNumber: number;
  proyek: string;
  pertanyaan: string;
  opsi: string[];
  sumber: string;
  muncul: string;
  lewat: boolean;
  rahasia: boolean;
  terkunci: boolean;
};

export type HeaderRead =
  | {
      ok: true;
      map: ColumnMap;
      names: Record<ColumnKey, string | null>;
      open: SheetDecision[];
      headers: string[];
    }
  | { ok: false; error: string; headers: string[] };

export function readOpenDecisions(values: string[][]): HeaderRead {
  const headers = (values[0] ?? []).map((header) => String(header ?? ""));
  if (headers.every((header) => header.trim() === "")) {
    return { ok: false, error: "Tab Keputusan kosong atau tidak punya baris header.", headers };
  }
  const { map, names } = mapHeaders(headers);
  if (map.id == null || map.keputusan == null) {
    const shown = headers
      .map((header) => header.trim())
      .filter(Boolean)
      .map((header) => (containsSecret(header) ? "(rahasia)" : header))
      .join(", ");
    return {
      ok: false,
      error: `Header tab belum dikenali. Butuh kolom ID dan Keputusan. Header yang terbaca: ${shown || "(kosong)"}.`,
      headers,
    };
  }

  const open: SheetDecision[] = [];
  for (let index = 1; index < values.length; index++) {
    const row = values[index] ?? [];
    const id = cell(row, map.id);
    if (!id) continue;
    const keputusan = cell(row, map.keputusan);
    const waktu = cell(row, map.waktu);
    if (!isDecisionOpen(keputusan, waktu)) continue;
    const proyek = cell(row, map.proyek);
    const pertanyaan = cell(row, map.pertanyaan);
    const opsiRaw = cell(row, map.opsi);
    const sumber = cell(row, map.sumber);
    const muncul = cell(row, map.muncul);
    const secret =
      containsSecret(id) ||
      containsSecret(proyek) ||
      containsSecret(pertanyaan) ||
      containsSecret(opsiRaw) ||
      containsSecret(sumber) ||
      containsSecret(muncul);
    const locked = containsSecret(id);
    open.push({
      id: locked ? "" : id,
      rowNumber: index + 1,
      proyek: secret && containsSecret(proyek) ? REDACTED_PROJECT : proyek,
      pertanyaan: secret
        ? REDACTED_QUESTION
        : pertanyaan || "(Tanpa pertanyaan di kolom yang dikenali)",
      opsi: secret ? [...FALLBACK_OPTIONS] : parseQuestionOptions(pertanyaan),
      sumber: secret && containsSecret(sumber) ? "" : sumber,
      muncul: containsSecret(muncul) ? "" : muncul,
      lewat: truthy(cell(row, map.lewat)),
      rahasia: secret,
      terkunci: locked,
    });
  }
  return { ok: true, map, names, open, headers };
}

export type CellUpdate = { range: string; values: string[][] };

export type WritePlan =
  { ok: true; updates: CellUpdate[] } | { ok: false; status: number; error: string };

export function planDecisionWrite(args: {
  values: string[][];
  tab: string;
  id: string;
  keputusan: string;
  komentar: string;
  now: Date;
}): WritePlan {
  const read = readOpenDecisions(args.values);
  if (!read.ok) return { ok: false, status: 503, error: read.error };
  const keputusan = args.keputusan.trim();
  if (!keputusan) return { ok: false, status: 400, error: "Keputusan masih kosong." };
  if (keputusan.length > 500) {
    return { ok: false, status: 400, error: "Keputusan terlalu panjang (maks. 500 karakter)." };
  }
  const komentar = args.komentar.trim();
  if (komentar.length > 1000) {
    return { ok: false, status: 400, error: "Komentar terlalu panjang (maks. 1000 karakter)." };
  }

  const idColumn = read.map.id;
  if (idColumn == null) {
    return { ok: false, status: 503, error: "Kolom ID tidak ditemukan." };
  }
  const matches: number[] = [];
  for (let index = 1; index < args.values.length; index++) {
    const rowId = (args.values[index]?.[idColumn] ?? "").trim();
    if (rowId === args.id) matches.push(index);
  }
  if (matches.length === 0) {
    return { ok: false, status: 404, error: "Baris dengan ID itu tidak ada di tab Keputusan." };
  }
  if (matches.length > 1) {
    return { ok: false, status: 409, error: "ID itu muncul lebih dari sekali. Tidak ditulis." };
  }
  const rowIndex = matches[0] as number;
  const row = args.values[rowIndex] ?? [];
  const current = (row[read.map.keputusan as number] ?? "").trim();
  if (current) {
    return { ok: false, status: 409, error: "Keputusan sudah terisi. Tidak ditimpa." };
  }
  const waktu = read.map.waktu == null ? "" : (row[read.map.waktu] ?? "");
  if (waktu.trim()) {
    return { ok: false, status: 409, error: "Waktu WIB sudah terisi. Baris ini ditutup." };
  }
  if (read.map.waktu == null) {
    return {
      ok: false,
      status: 503,
      error: "Kolom Waktu WIB tidak ditemukan, catatan selesai tidak bisa ditulis.",
    };
  }
  if (komentar && read.map.catatan == null) {
    return {
      ok: false,
      status: 422,
      error: "Kolom Tanggapan saya tidak ditemukan, komentar tidak bisa disimpan.",
    };
  }

  const sheetRow = rowIndex + 1;
  const updates: CellUpdate[] = [
    {
      range: sheetA1(args.tab, read.map.keputusan as number, sheetRow),
      values: [[keputusan]],
    },
    {
      range: sheetA1(args.tab, read.map.waktu, sheetRow),
      values: [[withCompletion(waktu, args.now)]],
    },
  ];
  if (komentar && read.map.catatan != null) {
    const existing = (row[read.map.catatan] ?? "").trim();
    updates.push({
      range: sheetA1(args.tab, read.map.catatan, sheetRow),
      values: [[existing ? `${existing}\n${komentar}` : komentar]],
    });
  }
  return { ok: true, updates };
}
