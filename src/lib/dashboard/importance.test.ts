import assert from "node:assert/strict";
import test from "node:test";
import { compareDecisions, decisionImportance } from "@/lib/dashboard/importance";

const today = "2026-11-04";

function rank(pertanyaan: string, extra?: { muncul?: string; proyek?: string; lewat?: boolean }) {
  return decisionImportance({
    pertanyaan,
    muncul: extra?.muncul ?? "",
    proyek: extra?.proyek ?? "",
    lewat: extra?.lewat ?? false,
    today,
    tenggat: [{ proyek: "Bank soal", jatuhTempo: "2026-11-06" }],
  });
}

test("importance follows the due date, then how long the item has been waiting", () => {
  assert.equal(rank("Batas 25 Okt").penting, "Mendesak");
  assert.equal(rank("Batas 25 Okt").tenggat, "2026-10-25");
  assert.equal(rank("Sidang 7 Nov").penting, "Penting");
  assert.equal(rank("Sidang 7 Nov").tenggat, "2026-11-07");
  assert.equal(rank("Batas 12 Nov").penting, "Bisa nanti");
  assert.equal(rank("Pilih 2 atau 4 Des").tenggat, "2026-12-02");
  assert.equal(rank("Pilih 2 atau 4 Des").penting, "Bisa nanti");
  assert.equal(rank("Batas hari ini", { muncul: "26 Okt 2026" }).tenggat, "2026-10-26");
  assert.equal(rank("Batas hari ini", { muncul: "26 Okt 2026" }).penting, "Mendesak");
  assert.equal(rank("Paper lewat tenggat").penting, "Mendesak");
  assert.equal(rank("Lanjut kuliah?", { muncul: "27 Okt 2026" }).penting, "Mendesak");
  assert.equal(rank("Lanjut kuliah?", { muncul: "31 Okt 2026" }).penting, "Penting");
  assert.equal(rank("Lanjut kuliah?", { muncul: "4 Nov 2026" }).penting, "Bisa nanti");
  assert.equal(rank("Lanjut kuliah?", { proyek: "Bank soal" }).tenggat, "2026-11-06");
  assert.equal(rank("Lanjut kuliah?", { proyek: "Bank soal" }).penting, "Penting");
  assert.equal(rank("Tenggat 20 Nov", { proyek: "Bank soal" }).tenggat, "2026-11-20");
  assert.equal(rank("1 November 2026").tenggat, "2026-11-01");
});

test("cards sort Mendesak, then Penting, then Bisa nanti", () => {
  const cards = [
    { id: "C", penting: "Bisa nanti" as const, tenggat: "2026-12-01", muncul: "1 Nov 2026" },
    { id: "B", penting: "Penting" as const, tenggat: "2026-11-08", muncul: "2 Nov 2026" },
    { id: "A", penting: "Mendesak" as const, tenggat: "2026-11-04", muncul: "3 Nov 2026" },
    { id: "A2", penting: "Mendesak" as const, tenggat: "2026-11-02", muncul: "4 Nov 2026" },
  ];
  assert.deepEqual(
    cards.sort(compareDecisions).map((item) => item.id),
    ["A2", "A", "B", "C"],
  );
});
