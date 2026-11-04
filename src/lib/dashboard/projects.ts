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
  /** Morning-routine health, such as Melambat. Not one of the four toggle values. */
  kesehatan: string | null;
  tautan: string | null;
};

const HEALTH_RANK = ["Tertahan", "Melambat", "Dorman", "Aktif", "Lainnya"];

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

function tokensOf(key: string): string[] {
  return key.match(/[a-z0-9]+/g)?.filter((token) => token.length >= 2) ?? [];
}

/**
 * One row per project. Variants fold into a seeded name when the variant
 * starts with that name ("ResearchGate full-text") or contains every word of
 * a multi-word name ("Seri Simulasi ICE" → "Seri ICE").
 */
export function canonicalProjectName(
  name: string,
  known: readonly string[] = SEED_PROJECTS,
): string {
  const cleaned = name.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  const key = projectKey(cleaned);
  const exact = known.find((item) => projectKey(item) === key);
  if (exact) return exact;

  const matches = known.filter((item) => {
    const canonical = projectKey(item);
    if (
      key.startsWith(`${canonical} `) ||
      key.startsWith(`${canonical}-`) ||
      key.startsWith(`${canonical}:`) ||
      key.startsWith(`${canonical}/`)
    ) {
      return true;
    }
    const wanted = tokensOf(canonical);
    const have = new Set(tokensOf(key));
    if (wanted.length >= 2 && wanted.every((token) => have.has(token))) return true;
    const only = wanted[0];
    return wanted.length === 1 && (only?.length ?? 0) >= 6 && have.has(only ?? "");
  });
  if (matches.length === 0) return cleaned;
  return (
    [...matches].sort(
      (a, b) => projectKey(b).length - projectKey(a).length || a.localeCompare(b, "id"),
    )[0] ?? cleaned
  );
}

function healthRank(value: string): number {
  const index = HEALTH_RANK.findIndex((item) => item.toLowerCase() === value.trim().toLowerCase());
  return index < 0 ? HEALTH_RANK.length : index;
}

export function mergeProjectStatus(
  snapshot: { nama: string; kategori: string; tautan: string | null }[],
  rows: SheetStatusRow[],
): StatusView[] {
  const groups = new Map<
    string,
    {
      nama: string;
      rows: SheetStatusRow[];
      kesehatan: string | null;
      tautan: string | null;
    }
  >();

  function groupFor(name: string) {
    const nama = canonicalProjectName(name);
    if (!nama || nama === REDACTED_PROJECT) return null;
    const key = projectKey(nama);
    const existing = groups.get(key);
    if (existing) return existing;
    const created = {
      nama,
      rows: [] as SheetStatusRow[],
      kesehatan: null as string | null,
      tautan: null as string | null,
    };
    groups.set(key, created);
    return created;
  }

  for (const row of rows) {
    const group = groupFor(row.proyek);
    if (!group) continue;
    group.rows.push(row);
  }
  for (const item of snapshot) {
    const group = groupFor(item.nama);
    if (!group) continue;
    const kategori = item.kategori.trim();
    if (
      kategori &&
      (group.kesehatan == null || healthRank(kategori) < healthRank(group.kesehatan))
    ) {
      group.kesehatan = kategori;
    }
    if (!group.tautan && item.tautan) group.tautan = item.tautan;
  }

  const views: StatusView[] = [];
  for (const group of groups.values()) {
    const exact = group.rows.filter((row) => projectKey(row.proyek) === projectKey(group.nama));
    const pool = exact.length > 0 ? exact : group.rows;
    const chosen = pool.find((row) => row.status) ?? pool[0];
    views.push({
      nama: group.nama,
      status: chosen?.status ?? null,
      statusMentah: chosen?.statusMentah ?? null,
      diubah: chosen?.diubah || null,
      kesehatan: group.kesehatan,
      tautan: group.tautan,
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
  const canonical = canonicalProjectName(proyek);
  const key = projectKey(canonical);
  const matches: number[] = [];
  for (let index = 1; index < args.values.length; index++) {
    const name = (args.values[index]?.[proyekCol] ?? "").trim();
    if (name && projectKey(canonicalProjectName(name)) === key) matches.push(index);
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
    { range: sheetA1(args.tab, proyekCol, sheetRow), values: [[canonical]] },
    { range: sheetA1(args.tab, statusCol, sheetRow), values: [[args.status]] },
    { range: sheetA1(args.tab, diubahCol, sheetRow), values: [[stamp]] },
  );
  return { ok: true, updates };
}

/** Append missing canonical projects and rename alias rows. Never changes Status or Diubah WIB. */
export function planProjectSeed(args: {
  values: string[][];
  tab: string;
  names: string[];
}): WritePlan {
  const wanted: string[] = [];
  const seenWanted = new Set<string>();
  for (const name of args.names) {
    const canonical = canonicalProjectName(name);
    const key = projectKey(canonical);
    if (!canonical || canonical === REDACTED_PROJECT || seenWanted.has(key)) continue;
    seenWanted.add(key);
    wanted.push(canonical);
  }
  const headers = args.values[0] ?? [];
  const blank = args.values.length === 0 || headers.every((cell) => cell.trim() === "");
  if (blank) {
    if (wanted.length === 0) return { ok: true, updates: [] };
    return {
      ok: true,
      updates: [
        {
          range: `'${args.tab.replaceAll("'", "''")}'!A1`,
          values: [[...STATUS_HEADERS], ...wanted.map((nama) => [nama, "", ""])],
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

  const keeper = new Map<string, { index: number; name: string; exact: boolean }>();
  for (let index = 1; index < args.values.length; index++) {
    const name = (args.values[index]?.[proyekCol] ?? "").trim();
    if (!name) continue;
    const canonical = canonicalProjectName(name);
    const key = projectKey(canonical);
    const exact = projectKey(name) === key;
    const current = keeper.get(key);
    if (!current || (exact && !current.exact)) keeper.set(key, { index, name, exact });
  }

  const updates: CellUpdate[] = [];
  for (const [key, row] of keeper) {
    const spelling =
      wanted.find((nama) => projectKey(nama) === key) ?? canonicalProjectName(row.name);
    if (row.name !== spelling) {
      updates.push({
        range: sheetA1(args.tab, proyekCol, row.index + 1),
        values: [[spelling]],
      });
    }
  }

  let last = 1;
  for (let index = 1; index < args.values.length; index++) {
    if ((args.values[index] ?? []).some((cell) => cell.trim())) last = index + 1;
  }
  for (const nama of wanted) {
    if (keeper.has(projectKey(nama))) continue;
    last += 1;
    updates.push(
      { range: sheetA1(args.tab, proyekCol, last), values: [[nama]] },
      { range: sheetA1(args.tab, statusCol, last), values: [[""]] },
      { range: sheetA1(args.tab, diubahCol, last), values: [[""]] },
    );
  }
  return { ok: true, updates };
}
