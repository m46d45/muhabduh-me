import assert from "node:assert/strict";
import test from "node:test";
import { containsSecret, containsSecretDeep } from "@/lib/dashboard/secret";
import { ingestSnapshot, rehydrateSnapshot } from "@/lib/dashboard/redact";
import { findClashes, wibDateKey, wibWeekRange } from "@/lib/dashboard/time";

const now = new Date("2026-11-04T02:35:00.000Z");

test("secret tokens match client names and leave ordinary words", () => {
  assert.equal(containsSecret("Rapat INPEX besok"), true);
  assert.equal(containsSecret("bahas masela"), true);
  assert.equal(containsSecret("kontrak OLNG"), true);
  assert.equal(containsSecret("Bayar IDR 5 juta"), true);
  assert.equal(containsSecret("IDR100"), true);
  assert.equal(containsSecret("(idr)"), true);
  assert.equal(containsSecret("hidrogen"), false);
  assert.equal(containsSecret("HIDROGEN"), false);
  assert.equal(containsSecret("Seminar internal"), false);
  assert.equal(containsSecret("valid"), false);
});

test("snapshot redacts confidential items before it can be stored", () => {
  const result = ingestSnapshot(
    {
      generatedAt: "2026-11-04T04:30:00+07:00",
      detail: "catatan INPEX yang tidak boleh ikut",
      agenda: [
        {
          judul: "Rapat INPEX Masela",
          mulai: "08.00",
          selesai: "09.30",
          lokasi: "Ruang OLNG",
          catatan: "bahas IDR",
          tautan: "https://example.com/inpex",
        },
        { judul: "Kuliah CIM", mulai: "10.00", selesai: "12.00", lokasi: "Lab" },
      ],
      tenggat: [{ judul: "Laporan IDR", jatuhTempo: "2026-11-06", proyek: "Masela" }],
      lookahead: [
        { tanggal: "2026-11-05", judul: "Site visit INPEX", mulai: "13.00", selesai: "15.00" },
      ],
      proyek: [
        {
          nama: "Proyek Masela",
          kategori: "Tertahan",
          tautan: "https://example.com/olng",
          catatan: "INPEX",
        },
        { nama: "Bank soal", kategori: "Aktif", tautan: "https://example.com/soal" },
      ],
    },
    now,
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const dumped = JSON.stringify(result.snapshot);
  assert.equal(containsSecretDeep(result.snapshot), false);
  assert.equal(dumped.toLowerCase().includes("inpex"), false);
  assert.equal(dumped.toLowerCase().includes("masela"), false);
  assert.equal(dumped.toLowerCase().includes("olng"), false);
  assert.equal(/(?:^|[^a-z])idr(?=[^a-z]|$)/.test(dumped.toLowerCase()), false);
  assert.equal(dumped.includes("detail"), false);
  assert.equal(result.redacted, 4);
  assert.equal(result.snapshot.agenda[0]?.judul, "Rapat klien (rahasia)");
  assert.equal(result.snapshot.agenda[0]?.mulai, "08.00");
  assert.equal(result.snapshot.agenda[0]?.selesai, "09.30");
  assert.equal(result.snapshot.agenda[0]?.lokasi, null);
  assert.equal(result.snapshot.agenda[0]?.tautan, null);
  assert.equal(result.snapshot.agenda[1]?.judul, "Kuliah CIM");
  assert.equal(result.snapshot.agenda[1]?.lokasi, "Lab");
  assert.equal(result.snapshot.tenggat[0]?.judul, "Tenggat klien (rahasia)");
  assert.equal(result.snapshot.lookahead[0]?.judul, "Rapat klien (rahasia)");
  assert.equal(result.snapshot.lookahead[0]?.mulai, "13.00");
  assert.equal(result.snapshot.proyek[0]?.nama, "Proyek klien (rahasia)");
  assert.equal(result.snapshot.proyek[0]?.tautan, null);
  assert.equal(result.snapshot.proyek[0]?.kategori, "Tertahan");
  assert.equal(result.snapshot.proyek[1]?.tautan, "https://example.com/soal");
});

test("reading a poisoned snapshot still strips confidential text", () => {
  const cleaned = rehydrateSnapshot({
    generatedAt: "2026-11-04T04:30:00+07:00",
    receivedAt: "2026-11-04T04:31:00.000Z",
    agenda: [{ judul: "Internal INPEX", mulai: "07.15", selesai: "08.00", rahasia: false }],
    tenggat: [],
    lookahead: [],
    proyek: [],
  });
  assert.ok(cleaned);
  assert.equal(cleaned?.agenda[0]?.judul, "Rapat klien (rahasia)");
  assert.equal(cleaned?.agenda[0]?.mulai, "07.15");
  assert.equal(containsSecretDeep(cleaned), false);
});

test("clock clashes and the WIB week use Jakarta time", () => {
  const clashes = findClashes([
    { judul: "Pagi", mulai: "08.00", selesai: "09.00" },
    { judul: "Tumpang", mulai: "08.30", selesai: "09.30" },
    { judul: "Siang", mulai: "10.00", selesai: "11.00" },
  ]);
  assert.equal(clashes.length, 1);
  assert.equal(clashes[0]?.a.judul, "Pagi");
  assert.equal(wibDateKey(now), "2026-11-04");
  assert.deepEqual(wibWeekRange("2026-11-04"), { start: "2026-11-02", end: "2026-11-08" });
});
