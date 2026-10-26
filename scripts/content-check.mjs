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

function fail(message) {
  throw new Error(`[content-check] ${message}`);
}

const papers = readPapers(root);
if (papers.length !== 151) fail(`papers.yaml harus 151 karya, ketemu ${papers.length}`);
const verified = papers.filter((paper) => paper.verified);
const hidden = papers.filter((paper) => !paper.verified);
if (verified.length !== 62) fail(`karya terverifikasi harus 62, ketemu ${verified.length}`);
if (hidden.length !== 89) fail(`karya tersembunyi harus 89, ketemu ${hidden.length}`);

const locked = {
  "2026-introducing-production-system-thinking-into-construction": {
    title:
      "Introducing production system thinking into construction management education: a multi-level framework based on the Indonesian context",
    doi: "10.1080/15623599.2026.2690041",
  },
  "2026-revealing-lean-aligned-practices-in-indonesian": {
    title:
      "Revealing Lean-aligned practices in Indonesian small contractors: a preliminary study",
    doi: "10.24928/2026/0153",
  },
  "2026-parade-tim-kerja-simulasi-dampak-variabilitas": {
    title:
      "Parade Tim Kerja: Simulasi Dampak Variabilitas dan Rancangan Zona Kerja pada Durasi Proyek",
    doi: null,
  },
};
for (const [id, expect] of Object.entries(locked)) {
  const paper = papers.find((item) => item.id === id);
  if (!paper) fail(`paper hilang: ${id}`);
  if (paper.title !== expect.title) fail(`judul berubah: ${id}`);
  if (paper.doi !== expect.doi) fail(`DOI berubah: ${id}`);
}

const published = buildSite(root, { tools, courses }, { includeDrafts: false });
const withDrafts = buildSite(root, { tools, courses }, { includeDrafts: true });

if (published.papers.length !== 62) {
  fail(`halaman publikasi memuat ${published.papers.length} karya, harus 62`);
}
if (published.papers.some((paper) => !paper.verified)) {
  fail("halaman publikasi memuat karya yang belum terverifikasi");
}
const paradeListed = published.papers.find(
  (paper) => paper.id === "2026-parade-tim-kerja-simulasi-dampak-variabilitas",
);
if (!paradeListed) fail("Parade Tim Kerja yang sudah terverifikasi tidak masuk daftar");
if (paradeListed.authors !== "Muhamad Abduh") fail("penulis Parade berubah");
if (paradeListed.doi !== null) fail("Parade belum punya DOI");
if (paradeListed.status !== "in-press") fail("status Parade berubah");

if (published.posts.length !== 0) {
  fail(`tulisan terbit harus 0, ketemu ${published.posts.length}`);
}
if (published.drafts.length !== 7) {
  fail(`harus ada 7 draf, ketemu ${published.drafts.length}`);
}

const sampleSlugs = [
  "01-parade-tim-kerja",
  "02-kompetensi-aliran-kerja",
  "03-kontraktor-kecil-lean",
];
if (withDrafts.posts.length !== 6) {
  fail(`pratinjau harus memuat 6 draf, ketemu ${withDrafts.posts.length}`);
}
for (const slug of [
  "els-opini-01-parade-tim-kerja",
  "els-opini-03-kontraktor-kecil-lean",
  "edu-pasangan-kuliah-dan-simulasi",
]) {
  const post = withDrafts.posts.find((item) => item.slug === slug);
  if (!post?.draft) fail(`draf bank hilang dari pratinjau: ${slug}`);
  if (published.posts.some((item) => item.slug === slug)) {
    fail(`draf bank masuk daftar terbit: ${slug}`);
  }
}
const opiniParade = withDrafts.posts.find(
  (post) => post.slug === "els-opini-01-parade-tim-kerja",
);
const opiniSmall = withDrafts.posts.find(
  (post) => post.slug === "els-opini-03-kontraktor-kecil-lean",
);
if (opiniParade?.papers[0]?.id !== "2026-parade-tim-kerja-simulasi-dampak-variabilitas") {
  fail("opini parade tidak menaut ke paper sumber");
}
if (opiniSmall?.papers[0]?.doi !== "10.24928/2026/0153") {
  fail("opini kontraktor kecil tidak menaut ke paper sumber");
}
const eduPost = withDrafts.posts.find(
  (post) => post.slug === "edu-pasangan-kuliah-dan-simulasi",
);
if (!eduPost?.topics.includes("pendidikan")) fail("draf Edu bukan topik pendidikan");
if (eduPost?.image) fail("draf tanpa ilustrasi tidak boleh punya gambar");
for (const slug of sampleSlugs) {
  if (!withDrafts.posts.some((post) => post.slug === slug && post.draft)) {
    fail(`draf pratinjau hilang: ${slug}`);
  }
  if (published.posts.some((post) => post.slug === slug)) {
    fail(`draf masuk daftar terbit: ${slug}`);
  }
}
if (withDrafts.posts.some((post) => post.slug === "draf-contoh")) {
  fail("berkas contoh format ikut pratinjau");
}

const paradePost = withDrafts.posts.find((post) => post.slug === "01-parade-tim-kerja");
const educationPost = withDrafts.posts.find(
  (post) => post.slug === "02-kompetensi-aliran-kerja",
);
const smallPost = withDrafts.posts.find((post) => post.slug === "03-kontraktor-kecil-lean");
if (paradePost.papers[0]?.id !== "2026-parade-tim-kerja-simulasi-dampak-variabilitas") {
  fail("tulisan parade tidak menaut ke paper sumber");
}
if (paradePost.papers[0]?.verified !== true) fail("paper parade seharusnya terverifikasi");
if (paradePost.papers[0]?.authors !== "Muhamad Abduh") fail("tulisan parade tidak memuat penulis");
if (paradePost.papers[0]?.doi != null) fail("tulisan parade tidak boleh punya DOI");
if (!paradePost.tools.some((tool) => tool.id === "parade-tim-kerja")) {
  fail("tulisan parade tidak menaut ke alat");
}
if (
  educationPost.papers[0]?.doi !== "10.1080/15623599.2026.2690041" ||
  educationPost.papers[0]?.verified !== true
) {
  fail("tulisan pendidikan tidak menaut ke paper sumber");
}
if (
  smallPost.papers[0]?.doi !== "10.24928/2026/0153" ||
  smallPost.papers[0]?.verified !== true
) {
  fail("tulisan kontraktor kecil tidak menaut ke paper sumber");
}
const educationPaper = withDrafts.papers.find(
  (paper) => paper.id === "2026-introducing-production-system-thinking-into-construction",
);
if (!educationPaper?.posts.some((post) => post.slug === educationPost.slug)) {
  fail("paper pendidikan tidak menaut balik ke draf");
}
const paradeTool = withDrafts.tools.find((tool) => tool.id === "parade-tim-kerja");
if (!paradeTool?.posts.some((post) => post.slug === paradePost.slug)) {
  fail("alat parade tidak menaut balik ke draf");
}

for (const list of [published.papers, published.tools, published.courses]) {
  for (const item of list) {
    if (item.posts.length) fail("tautan silang terbit memuat draf");
  }
}

const sampleTitles = withDrafts.posts.map((post) => post.title);
const rss = (await import("../src/lib/content/graph.mjs")).renderRss(published);
assertRssWellFormed(rss);
if (rss.includes("<item>")) fail("RSS terbit berisi item");
for (const title of sampleTitles) {
  if (rss.includes(title)) fail("RSS memuat judul draf");
}
if (rss.includes("Pertanyaan contoh")) fail("RSS memuat berkas contoh");
if (!rss.includes("https://muhabduh.id/blog")) fail("RSS tidak menunjuk ke /blog");
if (rss.includes("/bertanya")) fail("RSS masih menunjuk ke /bertanya");

const png = renderQuestionPng(sampleTitles[0]);
if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
  fail("OG bukan PNG");
}
if (png.length < 2000) fail("OG terlalu kecil");
fs.mkdirSync(path.join(root, "screenshots"), { recursive: true });
fs.writeFileSync(path.join(root, "screenshots", "og-draft-question.png"), png);

const ogPosts = process.env.VERCEL_ENV === "preview" ? withDrafts.posts : published.posts;
const ogDir = path.join(root, "public/og/blog");
fs.mkdirSync(ogDir, { recursive: true });
for (const name of fs.readdirSync(ogDir)) {
  if (!ogPosts.some((post) => name === `${post.slug}.png`)) {
    fs.unlinkSync(path.join(ogDir, name));
  }
}
for (const post of ogPosts) {
  fs.writeFileSync(
    path.join(ogDir, `${post.slug}.png`),
    renderQuestionPng(post.title),
  );
}

console.log(
  `[content-check] ok — ${papers.length} karya (${verified.length} tampil), ${published.posts.length} tulisan terbit, ${withDrafts.posts.length} draf pratinjau`,
);
