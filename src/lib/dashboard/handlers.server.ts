import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { containsSecret, containsSecretDeep } from "@/lib/dashboard/secret";
import { findClashes, isWithinLookahead, isWithinWeek, wibDateKey } from "@/lib/dashboard/time";
import { presentText, presentWarning } from "@/lib/dashboard/present";
import { ingestSnapshot, rehydrateSnapshot, type AgendaItem } from "@/lib/dashboard/redact";
import { planDecisionWrite, readOpenDecisions } from "@/lib/dashboard/decisions";
import {
  SEED_PROJECTS,
  STATUS_HEADERS,
  STATUS_TAB,
  mergeProjectStatus,
  planProjectSeed,
  planProjectStatusWrite,
  readStatusRows,
} from "@/lib/dashboard/projects";
import type { DecisionView } from "@/lib/dashboard/types";
import type { SnapshotStore } from "@/lib/dashboard/types";
import { hashProblem, verifyPassword } from "@/lib/dashboard/password.server";
import {
  clearFailures,
  lockedFailure,
  registerFailure,
  resetRateLimits,
} from "@/lib/dashboard/rate-limit";
import {
  readCookie,
  readSessionClaims,
  requestIsSecure,
  sessionCookie,
  signSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SEC,
} from "@/lib/dashboard/session.server";
import type { DashboardPayload } from "@/lib/dashboard/types";
import {
  ensureSheetTab,
  readNamedTab,
  readSheetValues,
  sheetConfig,
  sheetEditUrl,
  writeSheetCells,
  SheetConfigError,
} from "@/lib/dashboard/sheet.server";
import { blobStore, blobToken, SnapshotConfigError } from "@/lib/dashboard/store.server";
import { blobSessions, pruneSessions, type SessionRegistry } from "@/lib/dashboard/sessions.server";

const STALE_MS = 26 * 60 * 60 * 1000;

export type HandlerDeps = {
  now?: Date;
  sleep?: (ms: number) => Promise<void>;
  store?: SnapshotStore;
  readSheet?: () => Promise<{ values: string[][]; tab: string; sheetId: string }>;
  readStatus?: () => Promise<string[][]>;
  writeCells?: (updates: { range: string; values: string[][] }[]) => Promise<void>;
  sessions?: SessionRegistry;
};

function nowOf(deps: HandlerDeps): Date {
  return deps.now ?? new Date();
}

function sleepOf(deps: HandlerDeps): (ms: number) => Promise<void> {
  return deps.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
}

export function json(data: unknown, status = 200, headers?: Headers): Response {
  const responseHeaders = headers ?? new Headers();
  responseHeaders.set("content-type", "application/json; charset=utf-8");
  responseHeaders.set("cache-control", "private, no-store");
  responseHeaders.set("x-robots-tag", "noindex, nofollow");
  return new Response(JSON.stringify(data), { status, headers: responseHeaders });
}

function fail(error: string, status: number): Response {
  return json({ ok: false, error }, status);
}

export function methodNotAllowed(): Response {
  return fail("Metode tidak didukung.", 405);
}

async function readBody(
  request: Request,
  max = 200_000,
): Promise<{ ok: true; value: unknown } | { ok: false; response: Response }> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > max) {
    return { ok: false, response: fail("Isi permintaan terlalu besar.", 413) };
  }
  const text = await request.text();
  if (text.length > max) return { ok: false, response: fail("Isi permintaan terlalu besar.", 413) };
  if (!text.trim()) return { ok: true, value: {} };
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, response: fail("JSON tidak terbaca.", 400) };
  }
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const hostHeader = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const host = hostHeader?.split(",")[0]?.trim();
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function authConfig(): { hash: string; secret: string } | { error: string } {
  const hash = process.env.DASHBOARD_PASSWORD_HASH?.trim() ?? "";
  const secret = process.env.AUTH_SECRET?.trim() ?? "";
  if (!hash) return { error: "Kata sandi dasbor belum diatur (DASHBOARD_PASSWORD_HASH)." };
  const problem = hashProblem(hash);
  if (problem) return { error: problem };
  if (secret.length < 16) return { error: "AUTH_SECRET belum diatur atau terlalu pendek." };
  return { hash, secret };
}

function sessionsFor(deps: HandlerDeps): SessionRegistry {
  if (deps.sessions) return deps.sessions;
  const token = blobToken();
  if (!token) {
    throw new SnapshotConfigError(
      "Penyimpanan sesi belum diatur (BLOB_READ_WRITE_TOKEN). Keluar tidak bisa membatalkan salinan cookie.",
    );
  }
  return blobSessions(token);
}

async function requireSession(
  request: Request,
  now: number,
  deps: HandlerDeps,
): Promise<Response | null> {
  const config = authConfig();
  if ("error" in config) return fail(config.error, 503);
  const token = readCookie(request.headers.get("cookie"), SESSION_COOKIE);
  const claims = token ? readSessionClaims(token, config.secret, now) : null;
  if (!claims) return fail("Masuk dulu.", 401);
  try {
    const registry = sessionsFor(deps);
    const live = pruneSessions(await registry.list(), now);
    if (!live.some((session) => session.id === claims.sid)) return fail("Masuk dulu.", 401);
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sesi tidak bisa diperiksa.";
    return fail(message, 503);
  }
}

function tokensMatch(given: string, expected: string): boolean {
  const left = createHash("sha256").update(given).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

async function storeFor(deps: HandlerDeps): Promise<SnapshotStore> {
  if (deps.store) return deps.store;
  const token = blobToken();
  if (!token) {
    throw new SnapshotConfigError(
      "Penyimpanan snapshot belum diatur (BLOB_READ_WRITE_TOKEN). Sambungkan Vercel Blob ke proyek.",
    );
  }
  return blobStore(token);
}

export async function handlePostLogin(request: Request, deps: HandlerDeps = {}): Promise<Response> {
  if (!sameOrigin(request)) return fail("Asal permintaan tidak dikenali.", 403);
  const config = authConfig();
  if ("error" in config) return fail(config.error, 503);
  const key = clientKey(request);
  const nowMs = nowOf(deps).getTime();
  const locked = lockedFailure(key, nowMs);
  if (locked) {
    const headers = new Headers({ "retry-after": String(locked.retryAfterSec) });
    return json({ ok: false, error: "Terlalu banyak percobaan. Coba lagi nanti." }, 429, headers);
  }
  const body = await readBody(request, 8_000);
  if (!body.ok) return body.response;
  const password =
    body.value && typeof body.value === "object" && "password" in body.value
      ? String((body.value as { password?: unknown }).password ?? "")
      : "";
  const candidate = password.length > 200 ? "" : password;
  const valid = candidate.length > 0 && verifyPassword(candidate, config.hash);
  if (!valid) {
    const failure = registerFailure(key, nowMs);
    if (failure.locked) {
      const headers = new Headers({ "retry-after": String(failure.retryAfterSec) });
      return json({ ok: false, error: "Terlalu banyak percobaan. Coba lagi nanti." }, 429, headers);
    }
    await sleepOf(deps)(failure.delayMs);
    return fail("Kata sandi salah.", 401);
  }
  clearFailures(key);
  const headers = new Headers();
  try {
    const registry = sessionsFor(deps);
    const sid = randomBytes(16).toString("base64url");
    const exp = nowMs + SESSION_MAX_AGE_SEC * 1000;
    const live = pruneSessions(await registry.list(), nowMs);
    live.push({ id: sid, exp });
    await registry.save(live.slice(-8));
    headers.append(
      "set-cookie",
      sessionCookie(signSession(config.secret, sid, nowMs), requestIsSecure(request)),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sesi tidak bisa disimpan.";
    return fail(message, 503);
  }
  return json({ ok: true }, 200, headers);
}

export async function handlePostLogout(
  request: Request,
  deps: HandlerDeps = {},
): Promise<Response> {
  if (!sameOrigin(request)) return fail("Asal permintaan tidak dikenali.", 403);
  const headers = new Headers();
  headers.append("set-cookie", sessionCookie("", requestIsSecure(request), 0));
  const config = authConfig();
  if (!("error" in config)) {
    const token = readCookie(request.headers.get("cookie"), SESSION_COOKIE);
    const claims = token ? readSessionClaims(token, config.secret, nowOf(deps).getTime()) : null;
    if (claims) {
      try {
        const registry = sessionsFor(deps);
        const now = nowOf(deps).getTime();
        const live = pruneSessions(await registry.list(), now).filter(
          (session) => session.id !== claims.sid,
        );
        await registry.save(live);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Sesi tidak bisa dibatalkan.";
        return json({ ok: false, error: message }, 503, headers);
      }
    }
  }
  return json({ ok: true }, 200, headers);
}

export async function handleGetDashboard(
  request: Request,
  deps: HandlerDeps = {},
): Promise<Response> {
  const now = nowOf(deps);
  const denied = await requireSession(request, now.getTime(), deps);
  if (denied) return denied;

  const warnings: string[] = [];
  const today = wibDateKey(now);
  let generatedAt: string | null = null;
  let receivedAt: string | null = null;
  let stale = false;
  let agenda: DashboardPayload["agenda"] = [];
  let tenggat: DashboardPayload["tenggat"] = [];
  let lookahead: DashboardPayload["lookahead"] = [];
  let proyek: DashboardPayload["proyek"] = [];

  try {
    const store = await storeFor(deps);
    const raw = await store.read();
    const snapshot = raw == null ? null : rehydrateSnapshot(raw);
    if (!snapshot) {
      warnings.push(
        "Belum ada snapshot harian. Bot perlu mengirim POST /api/snapshot sekitar 04.30 WIB.",
      );
    } else if (containsSecretDeep(snapshot)) {
      warnings.push("Snapshot ditolak karena masih memuat data yang harus disaring.");
    } else {
      generatedAt = snapshot.generatedAt;
      receivedAt = snapshot.receivedAt;
      const age = now.getTime() - Date.parse(snapshot.receivedAt);
      stale = Number.isNaN(age) || age > STALE_MS;
      if (stale) {
        warnings.push("Snapshot lebih dari 26 jam. Routine 04.30 WIB mungkin belum masuk.");
      }
      agenda = presentAgenda([...snapshot.agenda].sort(byClock));
      tenggat = snapshot.tenggat.flatMap((item) => {
        const judul = presentText(item.judul);
        if (!judul) return [];
        const proyekName = presentText(item.proyek);
        return [{ ...item, judul, proyek: proyekName || null }];
      });
      lookahead = presentAgenda(
        snapshot.lookahead
          .filter((item) => isWithinLookahead(item.tanggal, today))
          .sort(byDateThenClock),
      );
      const categoryOrder = ["Tertahan", "Melambat", "Aktif", "Dorman", "Lainnya"];
      proyek = [...snapshot.proyek]
        .map((item) => ({ ...item, catatan: presentText(item.catatan) || null }))
        .sort((a, b) => {
          const left = categoryOrder.indexOf(a.kategori);
          const right = categoryOrder.indexOf(b.kategori);
          return (
            (left < 0 ? 99 : left) - (right < 0 ? 99 : right) || a.nama.localeCompare(b.nama, "id")
          );
        });
    }
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "Snapshot tidak bisa dibaca.");
  }

  let keputusan: DecisionView[] = [];
  let kolom: DashboardPayload["kolom"] = null;
  let tautanSheet: string | null = null;
  try {
    const sheet = deps.readSheet ? await deps.readSheet() : await readSheetValues();
    const parsed = readOpenDecisions(sheet.values, { today, tenggat });
    tautanSheet = sheetEditUrl(sheet.sheetId);
    if (!parsed.ok) {
      warnings.push(parsed.error);
    } else {
      kolom = parsed.names;
      if (!parsed.names.pertanyaan) {
        const headers = parsed.headers
          .map((header) => header.trim())
          .filter(Boolean)
          .map((header) => (containsSecretDeep(header) ? "(rahasia)" : header))
          .join(", ");
        warnings.push(`Kolom pertanyaan tidak dikenali. Header: ${headers}.`);
      }
      if (!parsed.names.waktu) {
        warnings.push(
          "Kolom Waktu WIB tidak dikenali. Keputusan terbuka tidak bisa ditutup dari halaman ini.",
        );
      }
      keputusan = parsed.open.map((item) => ({
        id: item.id,
        proyek: presentText(item.proyek),
        pertanyaan: presentText(item.pertanyaan) || "Apa yang perlu diputuskan?",
        opsi: item.opsi,
        sumber: "",
        muncul: "",
        lewat: item.lewat,
        rahasia: item.rahasia,
        terkunci: item.terkunci,
        penting: item.penting,
        tenggat: item.tenggat,
        munculLagi: item.munculLagi,
      }));
      if (containsSecretDeep(keputusan)) {
        keputusan = [];
        warnings.push(
          "Daftar keputusan disembunyikan karena masih memuat data yang harus disaring.",
        );
      }
    }
  } catch (error) {
    warnings.push(
      error instanceof SheetConfigError || error instanceof Error
        ? error.message
        : "Sheet tidak bisa dibaca.",
    );
  }

  let statusProyek: DashboardPayload["statusProyek"] = mergeProjectStatus(proyek, []).filter(
    (item) => !containsSecret(item.nama),
  );
  try {
    const statusValues = deps.readStatus ? await deps.readStatus() : await loadProjectStatusSheet();
    if (statusValues) {
      const parsedStatus = readStatusRows(statusValues);
      if (!parsedStatus.ok) warnings.push(parsedStatus.error);
      else {
        statusProyek = mergeProjectStatus(proyek, parsedStatus.rows)
          .filter((item) => !containsSecret(item.nama) && !containsSecret(item.diubah ?? ""))
          .map((item) =>
            containsSecret(item.kesehatan ?? "") ? { ...item, kesehatan: null } : item,
          );
        if (!deps.readStatus) {
          const seed = planProjectSeed({
            values: statusValues,
            tab: STATUS_TAB,
            names: statusProyek.map((item) => item.nama),
          });
          if (!seed.ok) warnings.push(seed.error);
          else if (seed.updates.length > 0) {
            if (deps.writeCells) await deps.writeCells(seed.updates);
            else await writeSheetCells(seed.updates);
          }
        }
      }
    }
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "Status proyek tidak bisa dibaca.");
  }

  const clashes = findClashes(agenda).map((pair) => ({ a: pair.a.judul, b: pair.b.judul }));
  const weekDeadlines = tenggat.filter((item) => isWithinWeek(item.jatuhTempo, today));
  const shownWarnings = [
    ...new Set(warnings.map(presentWarning).filter((warning) => warning.trim() !== "")),
  ];

  const payload: DashboardPayload = {
    ok: true,
    today,
    generatedAt,
    receivedAt,
    stale,
    warnings: shownWarnings,
    kolom,
    kartu: {
      keputusanTerbuka: keputusan.length,
      mendesak: keputusan.filter((item) => item.penting === "Mendesak").length,
      tenggatMingguIni: weekDeadlines.length,
      agendaHariIni: agenda.length,
      bentrok: clashes.length,
      tertahanDorman: statusProyek.filter(
        (item) => item.status === "Tertahan" || item.status === "Dorman",
      ).length,
    },
    agenda,
    bentrok: clashes,
    tenggat: weekDeadlines,
    lookahead,
    proyek,
    keputusan,
    tautanSheet,
    statusProyek,
  };
  return json(payload);
}

async function loadProjectStatusSheet(): Promise<string[][] | null> {
  const config = sheetConfig();
  if (!config.ok) return null;
  await ensureSheetTab(
    STATUS_TAB,
    [...STATUS_HEADERS],
    SEED_PROJECTS.map((nama) => [nama, "", ""]),
  );
  return (await readNamedTab(STATUS_TAB, { fresh: true })).values;
}

export async function handlePostKeputusan(
  request: Request,
  deps: HandlerDeps = {},
): Promise<Response> {
  if (!sameOrigin(request)) return fail("Asal permintaan tidak dikenali.", 403);
  const now = nowOf(deps);
  const denied = await requireSession(request, now.getTime(), deps);
  if (denied) return denied;
  const body = await readBody(request, 16_000);
  if (!body.ok) return body.response;
  const record =
    body.value && typeof body.value === "object" ? (body.value as Record<string, unknown>) : {};
  const id = typeof record.id === "string" ? record.id.trim() : "";
  const keputusan = typeof record.keputusan === "string" ? record.keputusan : "";
  const komentar = typeof record.komentar === "string" ? record.komentar : "";
  if (!id || id.length > 80 || /[\r\n]/.test(id)) {
    return fail("ID keputusan tidak valid.", 400);
  }
  try {
    const sheet = deps.readSheet ? await deps.readSheet() : await readSheetValues({ fresh: true });
    const plan = planDecisionWrite({
      values: sheet.values,
      tab: sheet.tab,
      id,
      keputusan,
      komentar,
      now,
    });
    if (!plan.ok) return fail(plan.error, plan.status);
    if (deps.writeCells) await deps.writeCells(plan.updates);
    else await writeSheetCells(plan.updates);
    return json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Keputusan tidak tersimpan.";
    return fail(message, 503);
  }
}

export async function handlePostStatusProyek(
  request: Request,
  deps: HandlerDeps = {},
): Promise<Response> {
  if (!sameOrigin(request)) return fail("Asal permintaan tidak dikenali.", 403);
  const now = nowOf(deps);
  const denied = await requireSession(request, now.getTime(), deps);
  if (denied) return denied;
  const body = await readBody(request, 8_000);
  if (!body.ok) return body.response;
  const record =
    body.value && typeof body.value === "object" ? (body.value as Record<string, unknown>) : {};
  const proyek = typeof record.proyek === "string" ? record.proyek : "";
  const status = typeof record.status === "string" ? record.status.trim() : "";
  if (containsSecret(proyek)) {
    return fail("Nama proyek itu tidak disimpan dari halaman ini.", 422);
  }
  try {
    const values = deps.readStatus ? await deps.readStatus() : await loadProjectStatusSheet();
    if (!values) {
      const config = sheetConfig();
      return fail(config.ok ? "Status proyek tidak bisa dibaca." : config.error, 503);
    }
    const plan = planProjectStatusWrite({
      values,
      tab: STATUS_TAB,
      proyek,
      status,
      now,
    });
    if (!plan.ok) return fail(plan.error, plan.status);
    if (deps.writeCells) await deps.writeCells(plan.updates);
    else await writeSheetCells(plan.updates);
    return json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Status proyek tidak tersimpan.";
    return fail(message, 503);
  }
}

export async function handlePostSnapshot(
  request: Request,
  deps: HandlerDeps = {},
): Promise<Response> {
  const expected = process.env.SNAPSHOT_TOKEN?.trim() ?? "";
  if (expected.length < 16) {
    return fail("SNAPSHOT_TOKEN belum diatur atau terlalu pendek.", 503);
  }
  const header = request.headers.get("authorization") ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const alternate = request.headers.get("x-snapshot-token")?.trim() ?? "";
  const given = bearer || alternate;
  if (!given || !tokensMatch(given, expected)) return fail("Token snapshot tidak valid.", 401);

  const body = await readBody(request);
  if (!body.ok) return body.response;
  const ingested = ingestSnapshot(body.value, nowOf(deps));
  if (!ingested.ok) return fail(ingested.error, 400);
  if (containsSecretDeep(ingested.snapshot)) {
    return fail("Snapshot masih memuat data yang harus disaring. Tidak disimpan.", 422);
  }
  try {
    const store = await storeFor(deps);
    await store.write(ingested.snapshot);
  } catch (error) {
    const message =
      error instanceof SnapshotConfigError || error instanceof Error
        ? error.message
        : "Snapshot tidak tersimpan.";
    return fail(message, 503);
  }
  return json({
    ok: true,
    receivedAt: ingested.snapshot.receivedAt,
    redacted: ingested.redacted,
  });
}

export function resetHandlerState(): void {
  resetRateLimits();
}

function presentAgenda(items: AgendaItem[]): AgendaItem[] {
  return items.flatMap((item) => {
    const judul = presentText(item.judul);
    if (!judul) return [];
    const lokasi = presentText(item.lokasi);
    const catatan = presentText(item.catatan);
    return [{ ...item, judul, lokasi: lokasi || null, catatan: catatan || null }];
  });
}

function byClock<T extends { mulai: string | null }>(a: T, b: T): number {
  return (a.mulai ?? "99.99").localeCompare(b.mulai ?? "99.99");
}

function byDateThenClock<T extends { tanggal: string | null; mulai: string | null }>(
  a: T,
  b: T,
): number {
  return (a.tanggal ?? "9999").localeCompare(b.tanggal ?? "9999") || byClock(a, b);
}
