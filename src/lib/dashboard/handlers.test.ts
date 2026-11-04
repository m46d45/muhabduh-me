import assert from "node:assert/strict";
import test from "node:test";
import { containsSecretDeep } from "@/lib/dashboard/secret";
import type { CleanSnapshot } from "@/lib/dashboard/redact";
import type { SnapshotStore } from "@/lib/dashboard/types";
import { hashPassword } from "@/lib/dashboard/password.server";
import { memorySessions, type SessionRegistry } from "@/lib/dashboard/sessions.server";
import {
  handleGetDashboard,
  handlePostKeputusan,
  handlePostLogin,
  handlePostLogout,
  handlePostSnapshot,
  handlePostStatusProyek,
  resetHandlerState,
} from "@/lib/dashboard/handlers.server";

const password = "frase-uji-yang-cukup-panjang";
const passwordHash = hashPassword(password);
const secret = "a".repeat(32);
const snapshotToken = "t".repeat(24);
const now = new Date("2026-11-04T02:00:00.000Z");

const headers = ["ID", "Proyek", "Pertanyaan", "Opsi", "Keputusan", "Waktu WIB", "Catatan"];
const sheet = {
  values: [
    headers,
    ["K-1", "Riset", "Lanjut kuliah?", "Ya | Tidak", "", "", ""],
    ["K-2", "INPEX", "Bahas Masela?", "A | B", "", "", ""],
  ],
  tab: "Keputusan",
  sheetId: "sheet-uji",
};

function memoryStore(): SnapshotStore & { saved: CleanSnapshot | null } {
  let saved: CleanSnapshot | null = null;
  return {
    get saved() {
      return saved;
    },
    async read() {
      return saved;
    },
    async write(snapshot) {
      saved = snapshot;
    },
  };
}

let sessions: SessionRegistry = memorySessions();

async function loginCookie(): Promise<string> {
  const response = await handlePostLogin(
    new Request("https://www.muhabduh.id/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        host: "www.muhabduh.id",
        origin: "https://www.muhabduh.id",
      },
      body: JSON.stringify({ password }),
    }),
    { now, sleep: async () => undefined, sessions },
  );
  assert.equal(response.status, 200);
  const cookie = response.headers.get("set-cookie") ?? "";
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /Secure/i);
  return cookie.split(";")[0] ?? "";
}

test.beforeEach(() => {
  process.env.DASHBOARD_PASSWORD_HASH = passwordHash;
  process.env.AUTH_SECRET = secret;
  process.env.SNAPSHOT_TOKEN = snapshotToken;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.SHEET_ID;
  sessions = memorySessions();
  resetHandlerState();
});

test("dashboard and write APIs reject missing auth", async () => {
  const dashboard = await handleGetDashboard(new Request("https://www.muhabduh.id/api/dashboard"), {
    now,
  });
  assert.equal(dashboard.status, 401);
  const keputusan = await handlePostKeputusan(
    new Request("https://www.muhabduh.id/api/keputusan", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://www.muhabduh.id",
        host: "www.muhabduh.id",
      },
      body: JSON.stringify({ id: "K-1", keputusan: "Ya", komentar: "" }),
    }),
    { now },
  );
  assert.equal(keputusan.status, 401);
  const status = await handlePostStatusProyek(
    new Request("https://www.muhabduh.id/api/status-proyek", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://www.muhabduh.id",
        host: "www.muhabduh.id",
      },
      body: JSON.stringify({ proyek: "RagilE", status: "Aktif" }),
    }),
    { now },
  );
  assert.equal(status.status, 401);
  const snapshot = await handlePostSnapshot(
    new Request("https://www.muhabduh.id/api/snapshot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ generatedAt: "2026-11-04T04:30:00+07:00" }),
    }),
    { now },
  );
  assert.equal(snapshot.status, 401);
  const bodies = await Promise.all([dashboard.json(), keputusan.json(), snapshot.json()]);
  assert.equal(JSON.stringify(bodies).toLowerCase().includes("inpex"), false);
});

test("snapshot token stores only redacted JSON", async () => {
  const store = memoryStore();
  const response = await handlePostSnapshot(
    new Request("https://www.muhabduh.id/api/snapshot", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${snapshotToken}`,
      },
      body: JSON.stringify({
        generatedAt: "2026-11-04T04:30:00+07:00",
        agenda: [
          {
            judul: "Rapat INPEX Masela",
            mulai: "08.00",
            selesai: "09.00",
            lokasi: "OLNG",
            catatan: "IDR",
          },
          { judul: "Kuliah", mulai: "10.00", selesai: "11.00" },
        ],
        tenggat: [
          { judul: "Kirim draf", jatuhTempo: "2026-11-06" },
          { judul: "Di luar minggu", jatuhTempo: "2026-11-20" },
        ],
        lookahead: [
          { tanggal: "2026-11-05", judul: "Bimbingan", mulai: "09.00", selesai: "10.00" },
          { tanggal: "2026-12-01", judul: "Terlalu jauh", mulai: "09.00", selesai: "10.00" },
        ],
        proyek: [
          { nama: "Bank soal", kategori: "Aktif" },
          { nama: "Arsip", kategori: "Dorman" },
          { nama: "Proyek Masela", kategori: "Tertahan" },
        ],
      }),
    }),
    { now, store },
  );
  assert.equal(response.status, 200);
  assert.equal(containsSecretDeep(store.saved), false);
  assert.equal(store.saved?.agenda[0]?.judul, "Rapat klien (rahasia)");
  assert.equal(store.saved?.agenda[0]?.mulai, "08.00");

  const cookie = await loginCookie();
  const dashboard = await handleGetDashboard(
    new Request("https://www.muhabduh.id/api/dashboard", { headers: { cookie } }),
    {
      now,
      sessions,
      store,
      readSheet: async () => sheet,
    },
  );
  assert.equal(dashboard.status, 200);
  const payload = (await dashboard.json()) as {
    kartu: {
      keputusanTerbuka: number;
      mendesak: number;
      tenggatMingguIni: number;
      bentrok: number;
      tertahanDorman: number;
    };
    keputusan: { id: string; pertanyaan: string; opsi: string[]; penting: string }[];
    tenggat: { judul: string }[];
    lookahead: { judul: string }[];
    tautanSheet: string;
    statusProyek: { nama: string }[];
  };
  assert.equal(containsSecretDeep(payload), false);
  assert.equal(payload.kartu.keputusanTerbuka, 2);
  assert.equal(payload.kartu.mendesak, 0);
  assert.equal(payload.kartu.tenggatMingguIni, 1);
  assert.equal(payload.kartu.agendaHariIni, 2);
  assert.equal(payload.kartu.bentrok, 0);
  assert.equal(payload.kartu.tertahanDorman, 0);
  assert.equal(
    payload.tenggat.some((item) => item.judul === "Di luar minggu"),
    false,
  );
  assert.equal(
    payload.lookahead.some((item) => item.judul === "Terlalu jauh"),
    false,
  );
  assert.deepEqual(payload.keputusan[0]?.opsi, [
    "Setuju, kerjakan",
    "Tolak, jangan dikerjakan",
    "Tunda, tanyakan lagi minggu depan",
    "Sudah saya tangani sendiri",
    "Abaikan / tidak relevan",
  ]);
  assert.equal(payload.keputusan[0]?.penting, "Bisa nanti");
  assert.equal(
    payload.statusProyek.some((item) => item.nama === "Bank soal"),
    true,
  );
  assert.equal(
    payload.statusProyek.some((item) => item.nama.includes("rahasia")),
    false,
  );
  assert.equal(payload.keputusan[1]?.pertanyaan, "Pertanyaan klien (rahasia)");
  assert.equal(payload.tautanSheet.includes("sheet-uji"), true);
});

test("decision write refuses a filled cell and records a completion note", async () => {
  const cookie = await loginCookie();
  const updates: { range: string; values: string[][] }[] = [];
  const denied = await handlePostKeputusan(
    new Request("https://www.muhabduh.id/api/keputusan", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
        origin: "https://www.muhabduh.id",
        host: "www.muhabduh.id",
      },
      body: JSON.stringify({ id: "K-9", keputusan: "Ya", komentar: "" }),
    }),
    {
      now,
      sessions,
      readSheet: async () => sheet,
      writeCells: async (next) => {
        updates.push(...next);
      },
    },
  );
  assert.equal(denied.status, 404);
  assert.equal(updates.length, 0);

  const saved = await handlePostKeputusan(
    new Request("https://www.muhabduh.id/api/keputusan", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
        origin: "https://www.muhabduh.id",
        host: "www.muhabduh.id",
      },
      body: JSON.stringify({ id: "K-1", keputusan: "Ya", komentar: "catatan bapak" }),
    }),
    {
      now,
      sessions,
      readSheet: async () => sheet,
      writeCells: async (next) => {
        updates.push(...next);
      },
    },
  );
  assert.equal(saved.status, 200);
  assert.equal(updates[0]?.values[0]?.[0], "Ya");
  assert.match(JSON.stringify(updates), /diputuskan via dashboard/);
  assert.match(JSON.stringify(updates), /catatan bapak/);

  updates.length = 0;
  const deferred = await handlePostKeputusan(
    new Request("https://www.muhabduh.id/api/keputusan", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
        origin: "https://www.muhabduh.id",
        host: "www.muhabduh.id",
      },
      body: JSON.stringify({
        id: "K-2",
        keputusan: "Tunda, tanyakan lagi minggu depan",
        komentar: "",
      }),
    }),
    {
      now,
      sessions,
      readSheet: async () => ({
        values: [headers, ["K-2", "Riset", "Nanti?", "", "", "", ""]],
        tab: "Keputusan",
        sheetId: "sheet-uji",
      }),
      writeCells: async (next) => {
        updates.push(...next);
      },
    },
  );
  assert.equal(deferred.status, 200);
  assert.match(JSON.stringify(updates), /tunda sampai 2026-11-11/);
});

test("visible copy drops agent notes while counts follow the lists", async () => {
  const store = memoryStore();
  const cookie = await loginCookie();
  const response = await handlePostSnapshot(
    new Request("https://www.muhabduh.id/api/snapshot", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${snapshotToken}`,
      },
      body: JSON.stringify({
        generatedAt: "2026-11-04T04:30:00+07:00",
        agenda: [
          {
            judul: "Kuliah (K-20261101-01)",
            mulai: "10.00",
            selesai: "11.00",
            catatan: "dicatat Kopi Pagi 1 Nov 2026 04.20",
          },
          { judul: "Bimbingan", mulai: "08.00", selesai: "09.00" },
        ],
        tenggat: [{ judul: "Kirim draf", jatuhTempo: "2026-11-06" }],
        lookahead: [],
        proyek: [
          {
            nama: "Paper PKPRB",
            kategori: "Melambat",
            catatan: "Target jurnal BELUM TERVERIFIKASI; PR #15 masih terbuka",
          },
        ],
      }),
    }),
    { now, store },
  );
  assert.equal(response.status, 200);
  const dashboard = await handleGetDashboard(
    new Request("https://www.muhabduh.id/api/dashboard", { headers: { cookie } }),
    {
      now,
      sessions,
      store,
      readSheet: async () => ({
        values: [
          ["ID", "Judul", "Keputusan", "Waktu WIB", "Proyek"],
          [
            "K-1",
            "Balas editor (lihat ringkasan_usulan.md) sebelum K-20261105-07?",
            "",
            "",
            "Rencana Paper",
          ],
          ["K-2", "Tunda ini?", "Tunda, tanyakan lagi minggu depan", "tunda sampai 2026-11-20", ""],
        ],
        tab: "Keputusan",
        sheetId: "sheet-uji",
      }),
      readStatus: async () => [
        ["Proyek", "Status", "Diubah WIB"],
        ["Paper PKPRB", "", ""],
        ["RagilE", "Dorman", ""],
      ],
    },
  );
  const payload = (await dashboard.json()) as {
    kartu: {
      keputusanTerbuka: number;
      mendesak: number;
      tertahanDorman: number;
      agendaHariIni: number;
    };
    agenda: { judul: string; catatan: string | null }[];
    keputusan: { pertanyaan: string; id: string }[];
    proyek: { catatan: string | null }[];
    warnings: string[];
  };
  assert.equal(payload.kartu.keputusanTerbuka, 1);
  assert.equal(payload.kartu.agendaHariIni, payload.agenda.length);
  assert.equal(payload.kartu.tertahanDorman, 1);
  assert.equal(
    payload.agenda.some((item) => item.judul.includes("K-2026")),
    false,
  );
  assert.equal(
    payload.agenda.some((item) => item.catatan?.includes("Kopi Pagi")),
    false,
  );
  assert.equal(payload.keputusan[0]?.id, "K-1");
  assert.equal(payload.keputusan[0]?.pertanyaan.includes("ringkasan_usulan.md"), false);
  assert.equal(payload.keputusan[0]?.pertanyaan.includes("K-2026"), false);
  assert.equal(JSON.stringify(payload.proyek).includes("BELUM TERVERIFIKASI"), false);
  assert.equal(JSON.stringify(payload.proyek).includes("PR #15"), false);
  assert.equal(JSON.stringify(payload).includes("Denyut"), false);
});

test("project status is written onto the status tab", async () => {
  const cookie = await loginCookie();
  const updates: { range: string; values: string[][] }[] = [];
  const saved = await handlePostStatusProyek(
    new Request("https://www.muhabduh.id/api/status-proyek", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
        origin: "https://www.muhabduh.id",
        host: "www.muhabduh.id",
      },
      body: JSON.stringify({ proyek: "RagilE", status: "Tertahan" }),
    }),
    {
      now,
      sessions,
      readStatus: async () => [
        ["Proyek", "Status", "Diubah WIB"],
        ["RagilE", "Aktif", ""],
      ],
      writeCells: async (next) => {
        updates.push(...next);
      },
    },
  );
  assert.equal(saved.status, 200);
  assert.equal(updates[0]?.values[0]?.[0], "Tertahan");
  assert.match(updates[1]?.values[0]?.[0] ?? "", /WIB/);
});

test("logout revokes a copied cookie", async () => {
  const first = await loginCookie();
  const second = await loginCookie();
  const alive = await handleGetDashboard(
    new Request("https://www.muhabduh.id/api/dashboard", { headers: { cookie: first } }),
    { now, sessions },
  );
  assert.equal(alive.status, 200);

  const logout = await handlePostLogout(
    new Request("https://www.muhabduh.id/api/logout", {
      method: "POST",
      headers: {
        cookie: first,
        origin: "https://www.muhabduh.id",
        host: "www.muhabduh.id",
      },
    }),
    { now, sessions },
  );
  assert.equal(logout.status, 200);

  const revoked = await handleGetDashboard(
    new Request("https://www.muhabduh.id/api/dashboard", { headers: { cookie: first } }),
    { now, sessions },
  );
  assert.equal(revoked.status, 401);

  const other = await handleGetDashboard(
    new Request("https://www.muhabduh.id/api/dashboard", { headers: { cookie: second } }),
    { now, sessions },
  );
  assert.equal(other.status, 200);
});
