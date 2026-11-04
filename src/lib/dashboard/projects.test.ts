import assert from "node:assert/strict";
import test from "node:test";
import { REDACTED_PROJECT } from "@/lib/dashboard/secret";
import {
  canonicalProjectName,
  mergeProjectStatus,
  planProjectSeed,
  planProjectStatusWrite,
  readStatusRows,
  STATUS_HEADERS,
} from "@/lib/dashboard/projects";

const now = new Date("2026-11-04T02:00:00.000Z");

test("status rows keep the current value and ignore a blank sheet", () => {
  const empty = readStatusRows([]);
  assert.equal(empty.ok, true);
  if (!empty.ok) return;
  assert.equal(empty.rows.length, 0);

  const read = readStatusRows([
    [...STATUS_HEADERS],
    ["RagilE", "Dorman", "01 Nov 2026 04.00 WIB"],
    ["Kuliah MBK", "Melambat", ""],
  ]);
  assert.equal(read.ok, true);
  if (!read.ok) return;
  assert.equal(read.rows[0]?.status, "Dorman");
  assert.equal(read.rows[1]?.status, null);
  assert.equal(read.rows[1]?.statusMentah, "Melambat");
});

test("a status write updates the matching row and can append a new project", () => {
  const values = [[...STATUS_HEADERS], ["RagilE", "Dorman", "01 Nov 2026 04.00 WIB"]];
  const updated = planProjectStatusWrite({
    values,
    tab: "Status Proyek",
    proyek: "ragile",
    status: "Aktif",
    now,
  });
  assert.equal(updated.ok, true);
  if (!updated.ok) return;
  assert.equal(updated.updates[0]?.range, "'Status Proyek'!B2");
  assert.equal(updated.updates[0]?.values[0]?.[0], "Aktif");
  assert.match(updated.updates[1]?.values[0]?.[0] ?? "", /04 Nov 2026 09\.00 WIB/);

  const appended = planProjectStatusWrite({
    values,
    tab: "Status Proyek",
    proyek: "Uji dasbor",
    status: "Selesai",
    now,
  });
  assert.equal(appended.ok, true);
  if (!appended.ok) return;
  assert.equal(appended.updates[0]?.values[0]?.[0], "Uji dasbor");
  assert.equal(appended.updates[1]?.range, "'Status Proyek'!B3");

  const rejected = planProjectStatusWrite({
    values,
    tab: "Status Proyek",
    proyek: "RagilE",
    status: "Melambat",
    now,
  });
  assert.equal(rejected.ok, false);
  if (rejected.ok) return;
  assert.equal(rejected.status, 400);
});

test("the status list shows the sheet value and adds snapshot projects that are missing", () => {
  const merged = mergeProjectStatus(
    [
      { nama: "RagilE", kategori: "Aktif", tautan: null },
      { nama: "Bank soal", kategori: "Tertahan", tautan: "https://example.com/soal" },
      { nama: REDACTED_PROJECT, kategori: "Dorman", tautan: null },
    ],
    [
      {
        proyek: "RagilE",
        status: "Dorman",
        statusMentah: null,
        diubah: "01 Nov 2026 04.00 WIB",
        rowNumber: 2,
      },
    ],
  );
  assert.equal(merged[0]?.nama, "RagilE");
  assert.equal(merged[0]?.status, "Dorman");
  assert.equal(merged[0]?.kesehatan, "Aktif");
  assert.equal(
    merged.some((item) => item.nama === "Bank soal"),
    true,
  );
  assert.equal(
    merged.some((item) => item.nama === REDACTED_PROJECT),
    false,
  );
});

test("aliases collapse to one canonical row and Melambat stays off the toggle", () => {
  assert.equal(canonicalProjectName("ResearchGate full-text"), "ResearchGate");
  assert.equal(canonicalProjectName("Seri Simulasi ICE"), "Seri ICE");
  assert.equal(canonicalProjectName("Bank soal"), "Bank soal");

  const merged = mergeProjectStatus(
    [
      { nama: "ResearchGate full-text", kategori: "Melambat", tautan: null },
      { nama: "Seri Simulasi ICE", kategori: "Aktif", tautan: null },
      { nama: "ResearchGate", kategori: "Tertahan", tautan: "https://example.com/rg" },
    ],
    [
      {
        proyek: "ResearchGate",
        status: null,
        statusMentah: null,
        diubah: "",
        rowNumber: 2,
      },
      {
        proyek: "Seri ICE",
        status: "Dorman",
        statusMentah: null,
        diubah: "02 Nov 2026 04.00 WIB",
        rowNumber: 3,
      },
      {
        proyek: "Kuliah MBK",
        status: null,
        statusMentah: "Melambat",
        diubah: "",
        rowNumber: 4,
      },
    ],
  );
  assert.equal(merged.length, 3);
  const research = merged.find((item) => item.nama === "ResearchGate");
  assert.equal(research?.status, null);
  assert.equal(research?.kesehatan, "Tertahan");
  const ice = merged.find((item) => item.nama === "Seri ICE");
  assert.equal(ice?.status, "Dorman");
  assert.equal(ice?.kesehatan, "Aktif");
  const course = merged.find((item) => item.nama === "Kuliah MBK");
  assert.equal(course?.status, null);
  assert.equal(course?.statusMentah, "Melambat");
  assert.equal(
    merged.some((item) => item.nama === "ResearchGate full-text"),
    false,
  );
  assert.equal(
    merged.some((item) => item.nama === "Seri Simulasi ICE"),
    false,
  );
});

test("seeding adds missing canonical projects and does not overwrite a saved status", () => {
  const values = [
    [...STATUS_HEADERS],
    ["ResearchGate full-text", "Aktif", "01 Nov 2026 04.00 WIB"],
    ["Seri ICE", "Dorman", "02 Nov 2026 04.00 WIB"],
  ];
  const seeded = planProjectSeed({
    values,
    tab: "Status Proyek",
    names: ["ResearchGate", "Seri Simulasi ICE", "Bank soal", "ResearchGate full-text"],
  });
  assert.equal(seeded.ok, true);
  if (!seeded.ok) return;
  const ranges = seeded.updates.map((update) => update.range);
  assert.equal(ranges.includes("'Status Proyek'!A2"), true);
  assert.equal(
    seeded.updates.find((update) => update.range.endsWith("A2"))?.values[0]?.[0],
    "ResearchGate",
  );
  assert.equal(
    seeded.updates.some((update) => update.range.endsWith("B2") || update.range.endsWith("C2")),
    false,
  );
  assert.equal(
    seeded.updates.some((update) => update.values[0]?.[0] === "Seri ICE"),
    false,
  );
  assert.equal(
    seeded.updates.some((update) => update.values[0]?.[0] === "Bank soal"),
    true,
  );
  assert.equal(
    seeded.updates.some((update) => update.values[0]?.[0] === "Dorman"),
    false,
  );
});
