import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { DecisionCard } from "@/components/dashboard/dashboard-screen";
import { DECISION_CHOICES, parseQuestionOptions } from "@/lib/dashboard/decisions";
import type { DecisionView } from "@/lib/dashboard/types";

const parsedQuestion =
  "LCI International: balas Glenn (Coordination Group, frekuensi laporan dan rapat); kirim draf apa adanya, tanpa paragraf opsional, ubah frekuensi rapat, atau tunda?";

function card(opsi: string[], id: string): DecisionView {
  return {
    id,
    proyek: "Riset",
    pertanyaan: "Apa yang perlu diputuskan?",
    opsi,
    rahasia: false,
    terkunci: false,
    penting: "Bisa nanti",
    tenggat: null,
  };
}

function assertHandledLast(html: string) {
  const marker = 'value="Sudah ditangani Abduh"';
  const other = 'value="Keputusan lain"';
  const start = html.indexOf(marker);
  const end = html.indexOf(other);
  assert.equal(html.split(marker).length - 1, 1);
  assert.ok(start >= 0 && end > start);
  const between = html.slice(start + marker.length, end);
  assert.equal(between.includes('value="'), false);
  assert.match(between, /Sudah saya tangani/);
  assert.equal(between.includes("sendiri"), false);
  assert.equal(html.includes('value="Sudah saya tangani"'), false);
}

test("the handled radio renders with parsed options, without them, and without a duplicate", () => {
  const withParsed = renderToStaticMarkup(
    <DecisionCard
      item={card(parseQuestionOptions(parsedQuestion), "K-parsed")}
      sheetUrl={null}
      onChanged={async () => undefined}
    />,
  );
  const withoutParsed = renderToStaticMarkup(
    <DecisionCard
      item={card(parseQuestionOptions("Lanjut kuliah besok?"), "K-plain")}
      sheetUrl={null}
      onChanged={async () => undefined}
    />,
  );
  const fixed = renderToStaticMarkup(
    <DecisionCard
      item={card([...DECISION_CHOICES], "K-fixed")}
      sheetUrl={null}
      onChanged={async () => undefined}
    />,
  );
  const duplicate = renderToStaticMarkup(
    <DecisionCard
      item={card(["Sudah ditangani", "Kirim draf", "Sudah saya tangani"], "K-dup")}
      sheetUrl={null}
      onChanged={async () => undefined}
    />,
  );

  for (const html of [withParsed, withoutParsed, fixed, duplicate]) {
    assertHandledLast(html);
  }
  assert.match(withParsed, /Kirim draf apa adanya/);
  assert.match(withoutParsed, /value="Setuju"/);
  assert.match(fixed, /Sudah saya tangani sendiri/);
  assert.match(duplicate, /Kirim draf/);
  assert.equal(/value="Sudah ditangani"(?! Abduh)/.test(duplicate), false);
});
