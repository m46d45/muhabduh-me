import assert from "node:assert/strict";
import test from "node:test";
import { containsSecretDeep } from "@/lib/dashboard/secret";
import {
  DECISION_CHOICES,
  deferralNote,
  isDecisionOpen,
  mapHeaders,
  parseQuestionOptions,
  planDecisionWrite,
  readOpenDecisions,
  toDecisionQuestion,
  TUNDA_DECISION,
} from "@/lib/dashboard/decisions";
import { completionNote } from "@/lib/dashboard/time";

const headers = ["ID", "Proyek", "Pertanyaan", "Opsi", "Keputusan", "Waktu WIB", "Catatan"];

test("open only when both Keputusan and Waktu WIB are empty", () => {
  assert.equal(isDecisionOpen("", ""), true);
  assert.equal(isDecisionOpen("  ", "  "), true);
  assert.equal(isDecisionOpen("", "4 Nov 08.00 WIB"), false);
  assert.equal(isDecisionOpen("Ya", ""), false);
  assert.equal(isDecisionOpen("", "sudah dibalas Abduh…"), false);
  assert.equal(isDecisionOpen("", "diputuskan via dashboard, 04 Nov 09.00 WIB"), false);
});

test("headers are discovered by name, including longer aliases", () => {
  const mapped = mapHeaders(["Kode keputusan", "Status Keputusan", "Waktu", "Komentar"]);
  assert.equal(mapped.names.id, "Kode keputusan");
  assert.equal(mapped.names.keputusan, "Status Keputusan");
  assert.equal(mapped.names.waktu, "Waktu");
  assert.equal(mapped.names.catatan, "Komentar");
  assert.equal(mapped.names.pertanyaan, null);
});

test("confidential decision text is masked before it is served", () => {
  const read = readOpenDecisions([
    headers,
    ["K-1", "Riset", "Lanjut kuliah?", "Ya | Tidak", "", "", ""],
    ["K-2", "Riset", "Sudah?", "", "Ya", "", ""],
    ["K-3", "INPEX", "Bahas Masela dan IDR?", "Tunda | Tolak", "", "", ""],
    ["K-OLNG-1", "Umum", "Jadwal", "", "", "", ""],
    ["K-4", "Riset", "Sudah dibalas", "", "", "sudah dibalas Abduh…", ""],
  ]);
  assert.equal(read.ok, true);
  if (!read.ok) return;
  assert.equal(read.open.length, 3);
  assert.equal(
    read.open.some((item) => item.pertanyaan === "Sudah dibalas"),
    false,
  );
  const visible = read.open.find((item) => item.id === "K-1");
  assert.equal(visible?.id, "K-1");
  assert.deepEqual(visible?.opsi, [
    "Setuju, kerjakan",
    "Tolak, jangan dikerjakan",
    "Tunda, tanyakan lagi minggu depan",
    "Sudah saya tangani sendiri",
    "Abaikan / tidak relevan",
  ]);
  assert.equal(visible?.rahasia, false);
  const masked = read.open.find((item) => item.id === "K-3");
  assert.equal(masked?.pertanyaan, "Pertanyaan klien (rahasia)");
  assert.equal(masked?.proyek, "Proyek klien (rahasia)");
  assert.deepEqual(masked?.opsi, visible?.opsi);
  assert.equal(masked?.id, "K-3");
  assert.equal(masked?.terkunci, false);
  const locked = read.open.find((item) => item.terkunci);
  assert.equal(locked?.id, "");
  assert.equal(locked?.terkunci, true);
  assert.equal(containsSecretDeep(read.open), false);
});

test("a filled keputusan cell is not overwritten", () => {
  const now = new Date("2026-11-04T02:40:00.000Z");
  const blocked = planDecisionWrite({
    values: [headers, ["K-2", "Riset", "Sudah?", "", "Ya", "4 Nov 08.00", ""]],
    tab: "Keputusan",
    id: "K-2",
    keputusan: "Tidak",
    komentar: "",
    now,
  });
  assert.equal(blocked.ok, false);
  if (blocked.ok) return;
  assert.equal(blocked.status, 409);

  const planned = planDecisionWrite({
    values: [headers, ["K-1", "Riset", "Lanjut?", "Ya|Tidak", "", "", "catatan lama"]],
    tab: "Keputusan",
    id: "K-1",
    keputusan: "Ya",
    komentar: "setuju di rapat",
    now,
  });
  assert.equal(planned.ok, true);
  if (!planned.ok) return;
  assert.equal(planned.updates[0]?.values[0]?.[0], "Ya");
  assert.equal(planned.updates[1]?.range, "'Keputusan'!F2");
  assert.match(
    planned.updates[1]?.values[0]?.[0] ?? "",
    /diputuskan via dashboard, 04 Nov 09\.40 WIB/,
  );
  assert.match(planned.updates[2]?.values[0]?.[0] ?? "", /catatan lama\nsetuju di rapat/);
  assert.equal(completionNote(now), "diputuskan via dashboard, 04 Nov 09.40 WIB");
});

const liveHeaders = ["ID", "Muncul", "Judul", "Keputusan", "Tanggapan saya", "Waktu WIB", "Proyek"];

test("live Keputusan headers use judul, tanggapan saya, and muncul", () => {
  const mapped = mapHeaders(liveHeaders);
  assert.equal(mapped.names.id, "ID");
  assert.equal(mapped.names.muncul, "Muncul");
  assert.equal(mapped.names.pertanyaan, "Judul");
  assert.equal(mapped.names.keputusan, "Keputusan");
  assert.equal(mapped.names.catatan, "Tanggapan saya");
  assert.equal(mapped.names.waktu, "Waktu WIB");
  assert.equal(mapped.names.proyek, "Proyek");
  assert.equal(mapHeaders(["ID", "Keputusan", "Tanggapan"]).names.catatan, "Tanggapan");

  const read = readOpenDecisions([
    liveHeaders,
    ["K-1", "4 Nov 2026", "Lanjut kuliah?", "", "", "", "Riset"],
    ["K-3", "29 Okt 2026", "Balasan", "", "", "sudah dibalas Abduh…", "Riset"],
    [
      "K-2",
      "1 Nov 2026",
      "Sudah",
      "Ya",
      "lama",
      "diputuskan via dashboard, 01 Nov 09.00 WIB",
      "Riset",
    ],
  ]);
  assert.equal(read.ok, true);
  if (!read.ok) return;
  assert.equal(read.open.length, 1);
  assert.equal(
    read.open.some((item) => item.pertanyaan === "Balasan"),
    false,
  );
  assert.equal(read.open[0]?.pertanyaan, "Lanjut kuliah?");
  assert.equal(read.open[0]?.muncul, "4 Nov 2026");
  assert.equal(read.open[0]?.proyek, "Riset");

  const now = new Date("2026-11-04T02:40:00.000Z");
  const blocked = planDecisionWrite({
    values: [liveHeaders, ["K-2", "1 Nov 2026", "Sudah", "Ya", "", "4 Nov 08.00 WIB", "Riset"]],
    tab: "Keputusan",
    id: "K-2",
    keputusan: "Tidak",
    komentar: "jangan timpa",
    now,
  });
  assert.equal(blocked.ok, false);
  if (blocked.ok) return;
  assert.equal(blocked.status, 409);

  const planned = planDecisionWrite({
    values: [
      liveHeaders,
      ["K-1", "4 Nov 2026", "Lanjut kuliah?", "", "tanggapan lama", "", "Riset"],
    ],
    tab: "Keputusan",
    id: "K-1",
    keputusan: "Ya",
    komentar: "setuju di rapat",
    now,
  });
  assert.equal(planned.ok, true);
  if (!planned.ok) return;
  assert.equal(planned.updates[0]?.range, "'Keputusan'!D2");
  assert.equal(planned.updates[0]?.values[0]?.[0], "Ya");
  assert.equal(planned.updates[1]?.range, "'Keputusan'!F2");
  assert.match(
    planned.updates[1]?.values[0]?.[0] ?? "",
    /diputuskan via dashboard, 04 Nov 09\.40 WIB/,
  );
  assert.equal(planned.updates[2]?.range, "'Keputusan'!E2");
  assert.equal(planned.updates[2]?.values[0]?.[0], "tanggapan lama\nsetuju di rapat");
});

test("options are parsed from the clause after the last semicolon or colon", () => {
  const question =
    "LCI International: balas Glenn (Coordination Group, frekuensi laporan dan rapat); kirim draf apa adanya, tanpa paragraf opsional, ubah frekuensi rapat, atau tunda?";
  assert.deepEqual(parseQuestionOptions(question), [
    "Kirim draf apa adanya",
    "Tanpa paragraf opsional",
    "Ubah frekuensi rapat",
    "Tunda",
  ]);
  assert.equal(parseQuestionOptions(question).includes("Coordination Group"), false);
  assert.deepEqual(parseQuestionOptions("setuju, tolak, atau tunda?"), [
    "Setuju",
    "Tolak",
    "Tunda",
  ]);
  assert.deepEqual(parseQuestionOptions("Pilih: kirim draf, atau tunda"), ["Kirim draf", "Tunda"]);
  assert.deepEqual(parseQuestionOptions("Lanjut kuliah besok?"), ["Setuju", "Tolak", "Tunda"]);
  assert.deepEqual(parseQuestionOptions(""), ["Setuju", "Tolak", "Tunda"]);
});

test("a title is a question, and a trailing option menu is not the question", () => {
  assert.equal(toDecisionQuestion("Lanjut kuliah?"), "Lanjut kuliah?");
  assert.equal(toDecisionQuestion("Cek berkas yang terunggah"), "Cek berkas yang terunggah?");
  assert.equal(toDecisionQuestion(""), "Apa yang perlu diputuskan?");
  assert.equal(
    toDecisionQuestion(
      "LCI International: balas Glenn (Coordination Group, frekuensi laporan dan rapat); kirim draf apa adanya, tanpa paragraf opsional, ubah frekuensi rapat, atau tunda?",
    ),
    "LCI International: balas Glenn (Coordination Group, frekuensi laporan dan rapat)?",
  );
});

test("tunda hides the card for 7 days, then lets it be decided again", () => {
  const hiddenAt = new Date("2026-11-04T02:40:00.000Z");
  const planned = planDecisionWrite({
    values: [liveHeaders, ["K-1", "4 Nov 2026", "Lanjut kuliah?", "", "", "", "Riset"]],
    tab: "Keputusan",
    id: "K-1",
    keputusan: TUNDA_DECISION,
    komentar: "minggu depan saja",
    now: hiddenAt,
  });
  assert.equal(planned.ok, true);
  if (!planned.ok) return;
  assert.equal(planned.updates[0]?.values[0]?.[0], TUNDA_DECISION);
  assert.match(planned.updates[1]?.values[0]?.[0] ?? "", /tunda sampai 2026-11-11/);
  assert.equal(deferralNote(hiddenAt).includes("tunda sampai 2026-11-11"), true);
  assert.equal(planned.updates[2]?.values[0]?.[0], "minggu depan saja");

  const deferredRow = [
    "K-1",
    "4 Nov 2026",
    "Lanjut kuliah?",
    TUNDA_DECISION,
    "minggu depan saja",
    planned.updates[1]?.values[0]?.[0] ?? "",
    "Riset",
  ];
  const hidden = readOpenDecisions([liveHeaders, deferredRow], { today: "2026-11-10" });
  assert.equal(hidden.ok, true);
  if (!hidden.ok) return;
  assert.equal(hidden.open.length, 0);

  const blocked = planDecisionWrite({
    values: [liveHeaders, deferredRow],
    tab: "Keputusan",
    id: "K-1",
    keputusan: DECISION_CHOICES[0],
    komentar: "",
    now: new Date("2026-11-10T02:00:00.000Z"),
  });
  assert.equal(blocked.ok, false);
  if (blocked.ok) return;
  assert.equal(blocked.status, 409);

  const shown = readOpenDecisions([liveHeaders, deferredRow], { today: "2026-11-11" });
  assert.equal(shown.ok, true);
  if (!shown.ok) return;
  assert.equal(shown.open.length, 1);
  assert.equal(shown.open[0]?.munculLagi, true);
  assert.equal(shown.open[0]?.pertanyaan, "Lanjut kuliah?");

  const again = planDecisionWrite({
    values: [liveHeaders, deferredRow],
    tab: "Keputusan",
    id: "K-1",
    keputusan: DECISION_CHOICES[0],
    komentar: "kerjakan sekarang",
    now: new Date("2026-11-11T02:40:00.000Z"),
  });
  assert.equal(again.ok, true);
  if (!again.ok) return;
  assert.equal(again.updates[0]?.values[0]?.[0], "Setuju, kerjakan");
  assert.match(again.updates[1]?.values[0]?.[0] ?? "", /^diputuskan via dashboard/);
  assert.equal((again.updates[1]?.values[0]?.[0] ?? "").includes("tunda sampai"), false);
});

test("unknown headers produce a clear error and no row dump", () => {
  const read = readOpenDecisions([
    ["Foo", "Bar"],
    ["rahasia INPEX", "jangan tampil"],
  ]);
  assert.equal(read.ok, false);
  if (read.ok) return;
  assert.match(read.error, /ID dan Keputusan/);
  assert.equal(read.error.includes("INPEX"), false);
  assert.equal(read.error.includes("jangan tampil"), false);
});
