import assert from "node:assert/strict";
import test from "node:test";
import { containsSecretDeep } from "@/lib/dashboard/secret";
import {
  isDecisionOpen,
  mapHeaders,
  parseQuestionOptions,
  planDecisionWrite,
  readOpenDecisions,
} from "@/lib/dashboard/decisions";
import { completionNote } from "@/lib/dashboard/time";

const headers = ["ID", "Proyek", "Pertanyaan", "Opsi", "Keputusan", "Waktu WIB", "Catatan"];

test("open means an empty keputusan and no completion note", () => {
  assert.equal(isDecisionOpen("", "4 Nov 08.00 WIB"), true);
  assert.equal(isDecisionOpen("Ya", "4 Nov 08.00 WIB"), false);
  assert.equal(isDecisionOpen("  ", "selesai dibahas"), false);
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
    ["K-1", "Riset", "Lanjut kuliah?", "Ya | Tidak", "", "4 Nov 08.00 WIB", ""],
    ["K-2", "Riset", "Sudah?", "", "Ya", "diputuskan via dashboard, 01 Nov 09.00 WIB", ""],
    ["K-3", "INPEX", "Bahas Masela dan IDR?", "Tunda | Tolak", "", "4 Nov 08.00", ""],
    ["K-OLNG-1", "Umum", "Jadwal", "", "", "4 Nov 09.00", ""],
  ]);
  assert.equal(read.ok, true);
  if (!read.ok) return;
  assert.equal(read.open.length, 3);
  const visible = read.open[0];
  assert.equal(visible?.id, "K-1");
  assert.deepEqual(visible?.opsi, ["Setuju", "Tolak", "Tunda"]);
  assert.equal(visible?.rahasia, false);
  const masked = read.open[1];
  assert.equal(masked?.pertanyaan, "Pertanyaan klien (rahasia)");
  assert.equal(masked?.proyek, "Proyek klien (rahasia)");
  assert.deepEqual(masked?.opsi, ["Setuju", "Tolak", "Tunda"]);
  assert.equal(masked?.id, "K-3");
  assert.equal(masked?.terkunci, false);
  const locked = read.open[2];
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
    values: [
      headers,
      ["K-1", "Riset", "Lanjut?", "Ya|Tidak", "", "4 Nov 08.00 WIB", "catatan lama"],
    ],
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
    ["K-1", "4 Nov 2026", "Lanjut kuliah?", "", "", "4 Nov 08.00 WIB", "Riset"],
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
      ["K-1", "4 Nov 2026", "Lanjut kuliah?", "", "tanggapan lama", "4 Nov 08.00 WIB", "Riset"],
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
