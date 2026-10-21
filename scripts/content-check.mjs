import fs from "node:fs";
import path from "node:path";
import { courses } from "../src/data/courses.mjs";
import { tools } from "../src/data/tools.mjs";
import {
  assertRssWellFormed,
  buildSite,
  readPapers,
} from "../src/lib/content/graph.mjs";
import { renderQuestionPng } from "./og-image.mjs";

const root = process.cwd();
const works = fs.readFileSync(path.join(root, "src/data/works.ts"), "utf8");
const publications = fs.readFileSync(
  path.join(root, "src/data/publications.ts"),
  "utf8",
);
const corpus = `${works}\n${publications}`;

function fail(message) {
  throw new Error(`[content-check] ${message}`);
}

const papers = readPapers(root);
if (papers.length < 26) fail(`publikasi.yaml hanya ${papers.length} karya`);

for (const paper of papers) {
  if (!corpus.includes(paper.title)) {
    fail(`judul tidak ada di data situs: ${paper.title}`);
  }
  if (paper.doi) {
    if (!works.includes(paper.doi)) fail(`DOI tidak ada di works.ts: ${paper.doi}`);
    const expected = `https://doi.org/${paper.doi}`;
    if (paper.href !== expected && !corpus.includes(paper.href)) {
      fail(`href DOI tidak cocok: ${paper.id}`);
    }
  } else if (!corpus.includes(paper.href)) {
    fail(`href tidak ada di data situs: ${paper.href}`);
  }
  if (paper.authors && !corpus.includes(paper.authors)) {
    fail(`penulis tidak ada di data situs: ${paper.id}`);
  }
  if (paper.summary && !corpus.includes(paper.summary)) {
    fail(`ringkasan tidak ada di data situs: ${paper.id}`);
  }
}

const published = buildSite(root, { tools, courses }, { includeDrafts: false });
const withDrafts = buildSite(root, { tools, courses }, { includeDrafts: true });

if (published.posts.length !== 0) {
  fail(`tulisan terbit harus 0, ketemu ${published.posts.length}`);
}
if (published.drafts.length !== 1) {
  fail(`harus ada tepat satu draf, ketemu ${published.drafts.length}`);
}
const draft = withDrafts.posts.find((post) => post.draft);
if (!draft) fail("draf tidak terbaca");
if (published.posts.some((post) => post.slug === draft.slug)) {
  fail("draf masuk daftar terbit");
}

const draftTitle = "Pertanyaan contoh yang belum ditulis?";
if (draft.title !== draftTitle) fail("judul draf berubah");

const paper = withDrafts.papers.find(
  (item) => item.id === "lean-construction-developing-countries-2026",
);
const tool = withDrafts.tools.find((item) => item.id === "siapkerja-lps");
const course = withDrafts.courses.find((item) => item.id === "ice-lean");
if (!paper?.posts.some((post) => post.slug === draft.slug)) {
  fail("paper tidak menaut balik ke draf saat includeDrafts");
}
if (!tool?.posts.some((post) => post.slug === draft.slug)) {
  fail("alat tidak menaut balik ke draf saat includeDrafts");
}
if (!course?.posts.some((post) => post.slug === draft.slug)) {
  fail("kuliah tidak menaut balik ke draf saat includeDrafts");
}
if (!draft.papers.some((item) => item.id === paper.id)) fail("draf tidak menaut ke paper");
if (!draft.tools.some((item) => item.id === "siapkerja-lps")) fail("draf tidak menaut ke alat");
if (!draft.courses.some((item) => item.id === "ice-lean")) fail("draf tidak menaut ke kuliah");
if (!draft.lean) fail("draf lean harus menaut IAMKRI/LCI");
if (draft.ogImage !== `https://muhabduh.id/og/blog/${draft.slug}.png`) {
  fail("og image draf tidak menunjuk ke /blog");
}

for (const list of [published.papers, published.tools, published.courses]) {
  for (const item of list) {
    if (item.posts.length) fail("tautan silang terbit memuat draf");
  }
}

const rss = (await import("../src/lib/content/graph.mjs")).renderRss(published);
assertRssWellFormed(rss);
if (rss.includes("<item>")) fail("RSS terbit berisi item");
if (rss.includes(draftTitle)) fail("RSS memuat judul draf");
if (!rss.includes("https://muhabduh.id/blog")) fail("RSS tidak menunjuk ke /blog");
if (rss.includes("/bertanya")) fail("RSS masih menunjuk ke /bertanya");

const png = renderQuestionPng(draftTitle);
if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
  fail("OG bukan PNG");
}
if (png.length < 2000) fail("OG terlalu kecil");
fs.mkdirSync(path.join(root, "screenshots"), { recursive: true });
fs.writeFileSync(path.join(root, "screenshots", "og-draft-question.png"), png);

const ogDir = path.join(root, "public/og/blog");
fs.mkdirSync(ogDir, { recursive: true });
for (const name of fs.readdirSync(ogDir)) {
  if (!published.posts.some((post) => name === `${post.slug}.png`)) {
    fs.unlinkSync(path.join(ogDir, name));
  }
}
for (const post of published.posts) {
  fs.writeFileSync(
    path.join(ogDir, `${post.slug}.png`),
    renderQuestionPng(post.title),
  );
}

console.log(
  `[content-check] ok — ${papers.length} karya, ${published.posts.length} tulisan terbit, 1 draf dikecualikan`,
);
