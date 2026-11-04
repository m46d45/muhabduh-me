import { sheetA1 } from "@/lib/dashboard/decisions";
import type { CellUpdate, WritePlan } from "@/lib/dashboard/decisions";
import { REDACTED_PROJECT } from "@/lib/dashboard/secret";
import { wibParts } from "@/lib/dashboard/time";

/**
 * Project heartbeat status lives on its own tab.
 * The per-task Status columns on ResearchGate, Personal Website, and the other
 * tracker tabs mean task progress (Sudah / Belum / …), not this lifecycle.
 */
export const STATUS_TAB = "Status Proyek";
export const STATUS_HEADERS = ["Proyek", "Status", "Diubah WIB"] as const;
export const PROJECT_STATUSES = ["Aktif", "Tertahan", "Dorman", "Selesai"] as const;

/** Tracker tabs named in the Petunjuk sheet. Seeded only when the status tab is created. */
export const SEED_PROJECTS = [
  "ResearchGate",
  "Personal Website",
  "LC Bibliometric",
  "RagilE",
  "Seri ICE",
  "Rencana Paper",
  "Kuliah MBK",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type SheetStatusRow = {
  proyek: string;
  status: ProjectStatus | null;
  statusMentah: string | null;
  diubah: string;
  rowNumber: number;
};

export type StatusView = {
  nama: string;
  status: ProjectStatus | null;
  statusMentah: string | null;
  diubah: string | null;
  snapshot: string | null;
  tautan: string | null;
};

export function statusStamp(now: Date): string {
  const parts = wibParts(now);
  return `${parts.day} ${parts.monthShort} ${parts.year} ${parts.hour}.${parts.minute} WIB`;
}

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}

function headerIndex(headers: string[], name: string): number | null {
  const want = name.trim().toLowerCase();
  const index = headers.findIndex((header) => header.trim().toLowerCase() === want);
  return index >= 0 ? index : null;
}

export function readStatusRows(
  values: string[][],
): { ok: true; rows: SheetStatusRow[] } | { ok: false; error: string } {
  if (values.length === 0 || (values[0] ?? []).every((cell) => cell.trim() === "")) {
    return { ok: true, rows: [] };
  }
  const headers = values[0] ?? [];
  const proyekCol = headerIndex(headers, "Proyek");
  const statusCol = headerIndex(headers, "Status");
  const diubahCol = headerIndex(headers, "Diubah WIB");
  if (proyekCol == null || statusCol == null || diubahCol == null) {
    return {
      ok: false,
      error: "Tab Status Proyek butuh kolom Proyek, Status, dan Diubah WIB.",
    };
  }
  const rows: SheetStatusRow[] = [];
  for (let index = 1; index < values.length; index++) {
    const row = values[index] ?? [];
    const proyek = (row[proyekCol] ?? "").trim();
    if (!proyek) continue;
    const raw = (row[statusCol] ?? "").trim();
    const known = isProjectStatus(raw);
    rows.push({
      proyek,
      status: known ? raw : null,
      statusMentah: raw && !known ? raw : null,
      diubah: (row[diubahCol] ?? "").trim(),
      rowNumber: index + 1,
    });
  }
  return { ok: true, rows };
}

function projectKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function mergeProjectStatus(
  snapshot: { nama: string; kategori: string; tautan: string | null }[],
  rows: SheetStatusRow[],
): StatusView[] {
  const views: StatusView[] = [];
  const seen = new Set<string>();
  const snapshotByName = new Map<string, { kategori: string; tautan: string | null }>();
  for (const item of snapshot) {
    const nama = item.nama.trim();
    if (!nama || nama === REDACTED_PROJECT) continue;
    snapshotByName.set(projectKey(nama), { kategori: item.kategori, tautan: item.tautan });
  }
  for (const row of rows) {
    if (row.proyek === REDACTED_PROJECT) continue;
    const key = projectKey(row.proyek);
    if (seen.has(key)) continue;
    seen.add(key);
    const fromSnapshot = snapshotByName.get(key);
    views.push({
      nama: row.proyek,
      status: row.status,
      statusMentah: row.statusMentah,
      diubah: row.diubah || null,
      snapshot: fromSnapshot?.kategori ?? null,
      tautan: fromSnapshot?.tautan ?? null,
    });
  }
  const extras = [...snapshotByName.entries()]
    .filter(([key]) => !seen.has(key))
    .sort((a, b) => a[0].localeCompare(b[0], "id"));
  for (const [key, item] of extras) {
    const nama = snapshot.find((entry) => projectKey(entry.nama) === key)?.nama ?? key;
    views.push({
      nama,
      status: null,
      statusMentah: null,
      diubah: null,
      snapshot: item.kategori,
      tautan: item.tautan,
    });
  }
  return views;
}

export function planProjectStatusWrite(args: {
  values: string[][];
  tab: string;
  proyek: string;
  status: string;
  now: Date;
}): WritePlan {
  const proyek = args.proyek.trim().replace(/\s+/g, " ");
  if (!proyek || proyek.length > 120 || /[\r\n]/.test(proyek)) {
    return { ok: false, status: 400, error: "Nama proyek tidak valid." };
  }
  if (!isProjectStatus(args.status)) {
    return { ok: false, status: 400, error: "Status harus Aktif, Tertahan, Dorman, atau Selesai." };
  }
  const stamp = statusStamp(args.now);
  const headers = args.values[0] ?? [];
  const blank = args.values.length === 0 || headers.every((cell) => cell.trim() === "");
  if (blank) {
    return {
      ok: true,
      updates: [
        {
          range: `'${args.tab.replaceAll("'", "''")}'!A1`,
          values: [[...STATUS_HEADERS], [proyek, args.status, stamp]],
        },
      ],
    };
  }
  const proyekCol = headerIndex(headers, "Proyek");
  const statusCol = headerIndex(headers, "Status");
  const diubahCol = headerIndex(headers, "Diubah WIB");
  if (proyekCol == null || statusCol == null || diubahCol == null) {
    return {
      ok: false,
      status: 503,
      error: "Tab Status Proyek butuh kolom Proyek, Status, dan Diubah WIB.",
    };
  }
  const key = projectKey(proyek);
  const matches: number[] = [];
  for (let index = 1; index < args.values.length; index++) {
    const name = (args.values[index]?.[proyekCol] ?? "").trim();
    if (name && projectKey(name) === key) matches.push(index);
  }
  if (matches.length > 1) {
    return {
      ok: false,
      status: 409,
      error: "Nama proyek itu muncul lebih dari sekali. Tidak ditulis.",
    };
  }
  const updates: CellUpdate[] = [];
  if (matches.length === 1) {
    const sheetRow = (matches[0] as number) + 1;
    updates.push(
      { range: sheetA1(args.tab, statusCol, sheetRow), values: [[args.status]] },
      { range: sheetA1(args.tab, diubahCol, sheetRow), values: [[stamp]] },
    );
    return { ok: true, updates };
  }
  let last = 1;
  for (let index = 1; index < args.values.length; index++) {
    if ((args.values[index] ?? []).some((cell) => cell.trim())) last = index + 1;
  }
  const sheetRow = last + 1;
  updates.push(
    { range: sheetA1(args.tab, proyekCol, sheetRow), values: [[proyek]] },
    { range: sheetA1(args.tab, statusCol, sheetRow), values: [[args.status]] },
    { range: sheetA1(args.tab, diubahCol, sheetRow), values: [[stamp]] },
  );
  return { ok: true, updates };
}
