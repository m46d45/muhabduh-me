import {
  REDACTED_DEADLINE,
  REDACTED_MEETING,
  REDACTED_PROJECT,
  containsSecret,
} from "@/lib/dashboard/secret";
import { formatClock, parseDateKey } from "@/lib/dashboard/time";

export type AgendaItem = {
  judul: string;
  mulai: string | null;
  selesai: string | null;
  tanggal: string | null;
  lokasi: string | null;
  catatan: string | null;
  tautan: string | null;
  rahasia: boolean;
};

export type TenggatItem = {
  judul: string;
  jatuhTempo: string | null;
  proyek: string | null;
  tautan: string | null;
  rahasia: boolean;
};

export type ProyekItem = {
  nama: string;
  kategori: string;
  tautan: string | null;
  catatan: string | null;
  rahasia: boolean;
};

export type CleanSnapshot = {
  generatedAt: string;
  receivedAt: string;
  agenda: AgendaItem[];
  tenggat: TenggatItem[];
  lookahead: AgendaItem[];
  proyek: ProyekItem[];
};

const KNOWN_CATEGORIES = ["Aktif", "Melambat", "Tertahan", "Dorman"] as const;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function text(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function safeUrl(value: unknown): string | null {
  const raw = text(value);
  if (!raw || containsSecret(raw)) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function cleanDate(value: unknown): string | null {
  const raw = text(value, 40);
  if (!raw || containsSecret(raw)) return null;
  return parseDateKey(raw);
}

function itemSecret(record: Record<string, unknown>, fields: string[]): boolean {
  return fields.some((field) => containsSecret(text(record[field], 2000)));
}

function knownCategory(value: unknown): string | null {
  const raw = text(value, 40);
  return KNOWN_CATEGORIES.find((category) => category.toLowerCase() === raw.toLowerCase()) ?? null;
}

function cleanCategory(value: unknown): string {
  const known = knownCategory(value);
  if (known) return known;
  const raw = text(value, 40);
  if (!raw || containsSecret(raw)) return "Lainnya";
  return raw;
}

export function redactMeeting(value: unknown): { item: AgendaItem; redacted: boolean } | null {
  const record = asRecord(value);
  if (!record) return null;
  const judul = text(record.judul);
  if (!judul) return null;
  const secret = itemSecret(record, ["judul", "lokasi", "catatan", "tautan", "id", "peserta"]);
  if (secret) {
    return {
      redacted: true,
      item: {
        judul: REDACTED_MEETING,
        mulai: formatClock(text(record.mulai, 8)),
        selesai: formatClock(text(record.selesai, 8)),
        tanggal: cleanDate(record.tanggal),
        lokasi: null,
        catatan: null,
        tautan: null,
        rahasia: true,
      },
    };
  }
  return {
    redacted: false,
    item: {
      judul,
      mulai: formatClock(text(record.mulai, 8)),
      selesai: formatClock(text(record.selesai, 8)),
      tanggal: cleanDate(record.tanggal),
      lokasi: text(record.lokasi) || null,
      catatan: text(record.catatan) || null,
      tautan: safeUrl(record.tautan),
      rahasia: false,
    },
  };
}

export function redactDeadline(value: unknown): { item: TenggatItem; redacted: boolean } | null {
  const record = asRecord(value);
  if (!record) return null;
  const judul = text(record.judul);
  if (!judul) return null;
  const secret = itemSecret(record, ["judul", "proyek", "tautan", "catatan", "id"]);
  if (secret) {
    return {
      redacted: true,
      item: {
        judul: REDACTED_DEADLINE,
        jatuhTempo: cleanDate(record.jatuhTempo),
        proyek: null,
        tautan: null,
        rahasia: true,
      },
    };
  }
  return {
    redacted: false,
    item: {
      judul,
      jatuhTempo: cleanDate(record.jatuhTempo),
      proyek: text(record.proyek) || null,
      tautan: safeUrl(record.tautan),
      rahasia: false,
    },
  };
}

export function redactProject(value: unknown): { item: ProyekItem; redacted: boolean } | null {
  const record = asRecord(value);
  if (!record) return null;
  const nama = text(record.nama);
  if (!nama) return null;
  const secret = itemSecret(record, ["nama", "catatan", "tautan", "id", "kategori"]);
  if (secret) {
    return {
      redacted: true,
      item: {
        nama: REDACTED_PROJECT,
        kategori: knownCategory(record.kategori) ?? "Lainnya",
        tautan: null,
        catatan: null,
        rahasia: true,
      },
    };
  }
  return {
    redacted: false,
    item: {
      nama,
      kategori: cleanCategory(record.kategori),
      tautan: safeUrl(record.tautan),
      catatan: text(record.catatan) || null,
      rahasia: false,
    },
  };
}

export type IngestResult =
  { ok: true; snapshot: CleanSnapshot; redacted: number } | { ok: false; error: string };

function list(value: unknown, max: number): unknown[] {
  if (value == null) return [];
  if (!Array.isArray(value)) return [];
  return value.slice(0, max);
}

export function ingestSnapshot(input: unknown, now: Date): IngestResult {
  const record = asRecord(input);
  if (!record) return { ok: false, error: "Snapshot harus berupa objek JSON." };
  const generatedAt = text(record.generatedAt, 40);
  const parsedTime = Date.parse(generatedAt);
  if (!generatedAt || Number.isNaN(parsedTime)) {
    return { ok: false, error: "generatedAt harus waktu ISO 8601." };
  }
  if (!Array.isArray(record.agenda ?? [])) {
    return { ok: false, error: "agenda harus berupa daftar." };
  }
  if (!Array.isArray(record.tenggat ?? []) || !Array.isArray(record.lookahead ?? [])) {
    return { ok: false, error: "tenggat dan lookahead harus berupa daftar." };
  }
  if (!Array.isArray(record.proyek ?? [])) {
    return { ok: false, error: "proyek harus berupa daftar." };
  }

  let redacted = 0;
  const agenda: AgendaItem[] = [];
  for (const entry of list(record.agenda, 80)) {
    const cleaned = redactMeeting(entry);
    if (!cleaned) continue;
    if (cleaned.redacted) redacted += 1;
    agenda.push(cleaned.item);
  }
  const tenggat: TenggatItem[] = [];
  for (const entry of list(record.tenggat, 80)) {
    const cleaned = redactDeadline(entry);
    if (!cleaned) continue;
    if (cleaned.redacted) redacted += 1;
    tenggat.push(cleaned.item);
  }
  const lookahead: AgendaItem[] = [];
  for (const entry of list(record.lookahead, 200)) {
    const cleaned = redactMeeting(entry);
    if (!cleaned) continue;
    if (cleaned.redacted) redacted += 1;
    lookahead.push(cleaned.item);
  }
  const proyek: ProyekItem[] = [];
  for (const entry of list(record.proyek, 80)) {
    const cleaned = redactProject(entry);
    if (!cleaned) continue;
    if (cleaned.redacted) redacted += 1;
    proyek.push(cleaned.item);
  }

  const snapshot: CleanSnapshot = {
    generatedAt: new Date(parsedTime).toISOString(),
    receivedAt: now.toISOString(),
    agenda,
    tenggat,
    lookahead,
    proyek,
  };
  return { ok: true, snapshot, redacted };
}

/** Run again on the way out, in case storage was written by an older build. */
export function rehydrateSnapshot(value: unknown): CleanSnapshot | null {
  const record = asRecord(value);
  if (!record) return null;
  const receivedAt = text(record.receivedAt, 40);
  const receivedMs = Date.parse(receivedAt);
  const ingested = ingestSnapshot(
    {
      generatedAt: record.generatedAt,
      agenda: record.agenda,
      tenggat: record.tenggat,
      lookahead: record.lookahead,
      proyek: record.proyek,
    },
    Number.isNaN(receivedMs) ? new Date() : new Date(receivedMs),
  );
  if (!ingested.ok) return null;
  return {
    ...ingested.snapshot,
    receivedAt: Number.isNaN(receivedMs)
      ? ingested.snapshot.receivedAt
      : new Date(receivedMs).toISOString(),
  };
}
