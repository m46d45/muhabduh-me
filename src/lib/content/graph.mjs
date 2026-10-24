import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { marked } from "marked";
import { TOPICS } from "./topics.mjs";

export { TOPICS };

const SITE_URL = "https://muhabduh.id";
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function fail(message) {
  throw new Error(`[content] ${message}`);
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asString(value, where) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string" || !value.trim()) fail(`${where} wajib diisi`);
  return value.trim();
}

function asOptionalString(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) {
    const names = value
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
    return names.length ? names.join(", ") : null;
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function topicBySlug(slug) {
  return TOPICS.find((topic) => topic.slug === slug) ?? null;
}

export function normalizeTopics(value, where) {
  if (value == null) return [];
  if (!Array.isArray(value)) fail(`${where}: topik harus daftar`);
  const slugs = [];
  for (const entry of value) {
    const raw = String(entry).trim().toLowerCase();
    const topic = TOPICS.find((item) => item.slug === raw || item.name.toLowerCase() === raw);
    if (!topic) {
      fail(
        `${where}: topik "${entry}" tidak dikenal. Pilih dari: ${TOPICS.map((item) => item.slug).join(", ")}`,
      );
    }
    if (!slugs.includes(topic.slug)) slugs.push(topic.slug);
  }
  return slugs;
}

function asDateString(value, where) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const text = asString(value, where);
  if (!DATE_RE.test(text)) fail(`${where}: tanggal harus YYYY-MM-DD`);
  return text;
}

function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

function renderMarkdown(markdown) {
  const parsed = marked.parse(markdown, { async: false, gfm: true });
  return sanitizeHtml(String(parsed));
}

function splitFrontmatter(raw, where) {
  const text = raw.replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) fail(`${where}: frontmatter wajib diawali ---`);
  const end = text.indexOf("\n---", 3);
  if (end < 0) fail(`${where}: frontmatter tidak ditutup`);
  const yamlText = text.slice(3, end).trim();
  const body = text.slice(end + 4).replace(/^\r?\n/, "");
  let data;
  try {
    data = parseYaml(yamlText);
  } catch (error) {
    fail(`${where}: YAML frontmatter rusak (${error instanceof Error ? error.message : error})`);
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    fail(`${where}: frontmatter harus berupa peta`);
  }
  return { data, body };
}

const PAPER_KINDS = ["journal", "conference", "book", "chapter", "paper", "article"];

/** Keep the five public topic slugs. Other tags stay in the file and are not pages. */
function publicTopics(value) {
  if (value == null) return [];
  if (!Array.isArray(value)) return [];
  const slugs = [];
  for (const entry of value) {
    const raw = String(entry).trim().toLowerCase();
    const topic = TOPICS.find((item) => item.slug === raw || item.name.toLowerCase() === raw);
    if (topic && !slugs.includes(topic.slug)) slugs.push(topic.slug);
  }
  return slugs;
}

function parsePapersYaml(text) {
  let data;
  try {
    data = parseYaml(text);
  } catch (error) {
    fail(`papers.yaml rusak (${error instanceof Error ? error.message : error})`);
  }
  if (!Array.isArray(data)) fail("papers.yaml harus berupa daftar");
  const seen = new Set();
  return data.map((entry, index) => {
    const where = `papers.yaml#${index + 1}`;
    if (!entry || typeof entry !== "object") fail(`${where} bukan peta`);
    const id = asString(entry.id, `${where} id`);
    if (!SLUG_RE.test(id)) fail(`${where}: id "${id}" bukan slug`);
    if (seen.has(id)) fail(`id publikasi ganda: ${id}`);
    seen.add(id);
    const kind = asString(entry.type ?? entry.kind, `${where} type`);
    if (!PAPER_KINDS.includes(kind)) fail(`${where}: type "${kind}" tidak dikenal`);
    const title = asString(entry.title, `${where} title`);
    const doi = asOptionalString(entry.doi);
    const href = asOptionalString(entry.url ?? entry.href);
    return {
      id,
      title,
      year: entry.year == null || entry.year === "" ? "" : asString(entry.year, `${where} year`),
      venue: asOptionalString(entry.venue) ?? "",
      kind,
      href,
      authors: asOptionalString(entry.authors),
      doi,
      summary: asOptionalString(entry.ringkasan ?? entry.summary),
      topics: publicTopics(entry.topics ?? entry.topik),
      verified: entry.verified === true,
      status: asOptionalString(entry.status),
    };
  });
}

export function readPapers(root) {
  const file = path.join(root, "data", "papers.yaml");
  if (!fs.existsSync(file)) fail("data/papers.yaml tidak ada");
  return parsePapersYaml(fs.readFileSync(file, "utf8"));
}

function parsePostFile(name, raw) {
  const slug = name.slice(0, -3);
  const where = `content/blog/${name}`;
  if (!SLUG_RE.test(slug)) fail(`${where}: nama berkas bukan slug`);
  const { data, body } = splitFrontmatter(raw, where);
  if (data.slug != null && String(data.slug) !== slug) {
    fail(`${where}: slug frontmatter harus sama dengan nama berkas`);
  }
  const title = asString(data.title, `${where} title`);
  if (!title.includes("?")) fail(`${where}: judul harus berbentuk pertanyaan`);
  const description = asString(data.description, `${where} description`);
  if (description.length > 220) fail(`${where}: description lebih dari satu kalimat`);
  const topics = normalizeTopics(data.topics ?? data.topik, where);
  if (topics.length < 1 || topics.length > 4) {
    fail(`${where}: isi 1–4 topik`);
  }
  const list = (value, label) => {
    if (value == null) return [];
    if (!Array.isArray(value)) fail(`${where}: ${label} harus daftar`);
    return value.map((item) => asString(item, `${where} ${label}`));
  };
  return {
    slug,
    title,
    description,
    date: asDateString(data.date, `${where} date`),
    draft: data.draft === true,
    preview: data.preview !== false,
    topics,
    paperIds: list(data.papers, "papers"),
    toolIds: list(data.tools, "tools"),
    courseIds: list(data.courses, "courses"),
    html: renderMarkdown(body.trim()),
  };
}

export function readPosts(root) {
  const dir = path.join(root, "content", "blog");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => parsePostFile(name, fs.readFileSync(path.join(dir, name), "utf8")));
}

function readSources(root) {
  const file = path.join(root, "data", "papers.yaml");
  if (!fs.existsSync(file)) fail("data/papers.yaml tidak ada");
  const dir = path.join(root, "content", "blog");
  const posts = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((name) => name.endsWith(".md"))
        .sort()
        .map((name) => ({
          name,
          text: fs.readFileSync(path.join(dir, name), "utf8"),
        }))
    : [];
  return { papersYaml: fs.readFileSync(file, "utf8"), posts };
}

function card(post) {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    topics: post.topics,
  };
}

/**
 * @param {{ papersYaml: string, posts: { name: string, text: string }[] }} sources
 * @param {{ tools: {id: string, title: string, appUrl?: string, topics?: string[]}[], courses: {id: string, title: string, href: string}[] }} catalogs
 * @param {{ includeDrafts?: boolean }} [options]
 */
export function buildSiteFromSources(sources, catalogs, options = {}) {
  const includeDrafts = options.includeDrafts === true;
  const papers = parsePapersYaml(sources.papersYaml);
  const allPosts = sources.posts.map((post) => parsePostFile(post.name, post.text));
  const paperById = new Map(papers.map((paper) => [paper.id, paper]));
  const toolById = new Map(catalogs.tools.map((tool) => [tool.id, tool]));
  const courseById = new Map(catalogs.courses.map((course) => [course.id, course]));

  for (const post of allPosts) {
    const where = `content/blog/${post.slug}.md`;
    for (const id of post.paperIds) {
      if (!paperById.has(id)) fail(`${where}: papers id "${id}" tidak ada di papers.yaml`);
    }
    for (const id of post.toolIds) {
      if (!toolById.has(id)) fail(`${where}: tools id "${id}" tidak ada`);
    }
    for (const id of post.courseIds) {
      if (!courseById.has(id)) fail(`${where}: courses id "${id}" tidak ada`);
    }
  }

  const visible = allPosts
    .filter((post) => {
      if (!post.draft) return true;
      return includeDrafts && post.preview !== false;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));

  const posts = visible.map((post) => {
    const related = visible
      .filter(
        (other) =>
          other.slug !== post.slug && other.topics.some((topic) => post.topics.includes(topic)),
      )
      .slice(0, 3)
      .map(card);
    return {
      ...post,
      papers: post.paperIds.map((id) => paperById.get(id)),
      tools: post.toolIds.map((id) => {
        const tool = toolById.get(id);
        return {
          id: tool.id,
          title: tool.title,
          href: `/tools#${tool.id}`,
          appUrl: tool.appUrl ?? null,
        };
      }),
      courses: post.courseIds.map((id) => {
        const course = courseById.get(id);
        return { id: course.id, title: course.title, href: course.href };
      }),
      related,
      lean: post.topics.includes("lean"),
      ogImage: `${SITE_URL}/og/blog/${post.slug}.png`,
    };
  });

  const papersOut = papers
    .filter((paper) => paper.verified)
    .map((paper) => ({
      ...paper,
      posts: posts
        .filter((post) => post.paperIds.includes(paper.id))
        .map((post) => ({ slug: post.slug, title: post.title })),
    }));

  const toolsOut = catalogs.tools.map((tool) => ({
    id: tool.id,
    title: tool.title,
    href: `/tools#${tool.id}`,
    appUrl: tool.appUrl ?? null,
    topics: Array.isArray(tool.topics) ? tool.topics : [],
    posts: posts
      .filter((post) => post.toolIds.includes(tool.id))
      .map((post) => ({ slug: post.slug, title: post.title })),
  }));

  const coursesOut = catalogs.courses.map((course) => ({
    id: course.id,
    title: course.title,
    href: course.href,
    posts: posts
      .filter((post) => post.courseIds.includes(course.id))
      .map((post) => ({ slug: post.slug, title: post.title })),
  }));

  return {
    siteUrl: SITE_URL,
    topics: TOPICS,
    papers: papersOut,
    posts,
    tools: toolsOut,
    courses: coursesOut,
    drafts: allPosts.filter((post) => post.draft).map(card),
  };
}

/**
 * @param {string} root
 * @param {{ tools: {id: string, title: string, appUrl?: string, topics?: string[]}[], courses: {id: string, title: string, href: string}[] }} catalogs
 * @param {{ includeDrafts?: boolean }} [options]
 */
export function buildSite(root, catalogs, options = {}) {
  return buildSiteFromSources(readSources(root), catalogs, options);
}

export function renderRss(site) {
  const items = site.posts
    .map((post) => {
      const link = `${site.siteUrl}/blog/${post.slug}`;
      const pub = new Date(`${post.date}T00:00:00Z`).toUTCString();
      return [
        "    <item>",
        `      <title>${xmlEscape(post.title)}</title>`,
        `      <link>${xmlEscape(link)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(link)}</guid>`,
        `      <pubDate>${xmlEscape(pub)}</pubDate>`,
        `      <description>${xmlEscape(post.description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const last = site.posts[0]?.date
    ? new Date(`${site.posts[0].date}T00:00:00Z`).toUTCString()
    : new Date("2026-10-21T00:00:00Z").toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Memulai dengan Bertanya — Muhamad Abduh</title>
    <link>${site.siteUrl}/blog</link>
    <description>Seri tulisan Muhamad Abduh. Setiap tulisan dimulai dari satu pertanyaan yang berangkat dari situasi penelitian.</description>
    <language>id</language>
    <lastBuildDate>${xmlEscape(last)}</lastBuildDate>
    <atom:link href="${site.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items ? `${items}\n` : ""}  </channel>
</rss>
`;
}

export function assertRssWellFormed(xml) {
  if (!xml.startsWith("<?xml")) fail("RSS tanpa deklarasi XML");
  if (!xml.includes('<rss version="2.0"')) fail("RSS bukan versi 2.0");
  if (!xml.includes(`${SITE_URL}/blog`)) fail("RSS tidak menunjuk ke /blog");
  const tags = [];
  const re = /<\/?([a-zA-Z0-9:-]+)(\s[^>]*)?>/g;
  let match;
  while ((match = re.exec(xml))) {
    const full = match[0];
    const name = match[1];
    if (full.startsWith("<?") || full.endsWith("/>") || full.startsWith("<!")) continue;
    if (full.startsWith("</")) {
      const open = tags.pop();
      if (open !== name) fail(`RSS tag tidak seimbang: ${open} vs ${name}`);
    } else {
      tags.push(name);
    }
  }
  if (tags.length) fail(`RSS tag belum ditutup: ${tags.join(", ")}`);
}
