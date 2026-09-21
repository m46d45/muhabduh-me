#!/usr/bin/env node
/**
 * ORCID public works checker for muhabduh.id
 *
 * Fetches https://orcid.org/0000-0001-6926-6665 works (public API) and lists
 * titles that do not appear in src/data/works.ts. Review manually — do not
 * invent DOIs; paste curated entries into works.ts when ready.
 *
 * Usage: node scripts/orcid-check.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ORCID = "0000-0001-6926-6665";
const WORKS_API = `https://pub.orcid.org/v3.0/${ORCID}/works`;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const worksSrc = readFileSync(join(root, "src/data/works.ts"), "utf8");

function normalize(title) {
  return title
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const localTitles = new Set();
for (const m of worksSrc.matchAll(/title:\s*\n?\s*"([^"]+)"/g)) {
  localTitles.add(normalize(m[1]));
}
for (const m of worksSrc.matchAll(/title:\s*\n?\s*`([^`]+)`/g)) {
  localTitles.add(normalize(m[1]));
}
// Multi-line string titles: title:\n    "foo"\n    "bar" — also catch joined
for (const m of worksSrc.matchAll(
  /title:\s*((?:\n\s*"[^"]*")+)/g,
)) {
  const joined = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).join(" ");
  if (joined) localTitles.add(normalize(joined));
}

const res = await fetch(WORKS_API, {
  headers: { Accept: "application/json" },
});
if (!res.ok) {
  console.error("ORCID fetch failed:", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
const groups = data.group ?? [];
const missing = [];
const seen = new Set();

for (const g of groups) {
  const summary = g["work-summary"]?.[0];
  if (!summary) continue;
  const title =
    summary.title?.title?.value ?? summary.title?.["translated-title"]?.value;
  if (!title) continue;
  const key = normalize(title);
  if (seen.has(key)) continue;
  seen.add(key);
  const year = summary["publication-date"]?.year?.value ?? "?";
  const putCode = summary["put-code"];
  const ext = summary["external-ids"]?.["external-id"] ?? [];
  const doi = ext.find((e) => e["external-id-type"] === "doi")?.[
    "external-id-value"
  ];
  if (![...localTitles].some((t) => t.includes(key) || key.includes(t))) {
    missing.push({ year, title, doi, putCode });
  }
}

missing.sort((a, b) => String(b.year).localeCompare(String(a.year)));

console.log(`Local works titles parsed: ${localTitles.size}`);
console.log(`ORCID public works (unique titles): ${seen.size}`);
console.log(`Possibly missing from works.ts: ${missing.length}\n`);

for (const m of missing.slice(0, 40)) {
  console.log(`- [${m.year}] ${m.title}`);
  if (m.doi) console.log(`  DOI: https://doi.org/${m.doi}`);
  else console.log(`  (no DOI in ORCID summary — put-code ${m.putCode})`);
}

if (missing.length > 40) {
  console.log(`\n…and ${missing.length - 40} more.`);
}

console.log(
  "\nSOP: review each line → add to src/data/works.ts with real venue/authors/DOI. News derives from works automatically.",
);
