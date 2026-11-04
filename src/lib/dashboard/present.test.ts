import assert from "node:assert/strict";
import test from "node:test";
import { presentText, presentWarning } from "@/lib/dashboard/present";

test("agent notes, ids, and file paths are removed from visible text", () => {
  assert.equal(
    presentText("Lanjutkan / bekukan / tutup? (K-20261031-05) (Menunggu keputusan)"),
    "Lanjutkan / bekukan / tutup? (Menunggu keputusan)",
  );
  assert.equal(
    presentText("Target jurnal dan tenggat BELUM TERVERIFIKASI; baru outline (13 Okt)"),
    "Target jurnal dan tenggat; baru outline (13 Okt)",
  );
  assert.equal(
    presentText(
      "Batch A, B, C belum dimulai; PR #15 masih terbuka sejak 26 Okt; dampak percepatan 29 Okt belum terverifikasi",
    ),
    "Batch A, B, C belum dimulai; dampak percepatan 29 Okt",
  );
  assert.equal(presentText("dicatat Kopi Pagi 30 Okt 2026 04.20"), "");
  assert.equal(presentText("diputuskan via dashboard, 05 Nov 05.00 WIB"), "");
  assert.equal(
    presentText(
      "putuskan butir di draf Red (lihat ringkasan_usulan.md dan Response Table di Drive)",
    ),
    "putuskan butir",
  );
  assert.equal(presentText("Rapat klien (rahasia)"), "Rapat klien (rahasia)");
  assert.equal(presentText("Kuliah 10.00–12.00"), "Kuliah 10.00–12.00");
});

test("operator warnings do not name the morning routine or env vars", () => {
  assert.equal(
    presentWarning(
      "Belum ada snapshot harian. Bot perlu mengirim POST /api/snapshot sekitar 04.30 WIB.",
    ),
    "Pembaruan pagi belum ada.",
  );
  assert.equal(
    presentWarning("Snapshot lebih dari 26 jam. Routine 04.30 WIB mungkin belum masuk."),
    "Pembaruan pagi sudah lebih dari sehari.",
  );
  assert.equal(
    presentWarning("Koneksi Google Sheet belum lengkap. Atur GOOGLE_SA_EMAIL dan SHEET_ID."),
    "Sambungan data belum lengkap.",
  );
});
