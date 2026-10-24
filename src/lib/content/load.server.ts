import { courses } from "@/data/courses.mjs";
import { tools } from "@/data/tools.mjs";
import { buildSiteFromSources, renderRss, topicBySlug } from "./graph.mjs";
import type { PostCard, TopicCard } from "./types";

/**
 * Content is read from the module graph, not from `process.cwd()`.
 * Prerender runs in the repo and can see `data/` and `content/`. The deployed
 * server function cannot: Vercel does not trace those `fs` paths, so a runtime
 * read throws `[content] data/papers.yaml tidak ada` and the client error
 * boundary replaces the prerendered page.
 */
const paperFiles = import.meta.glob("../../../data/papers.yaml", {
  query: "?raw",
  import: "default",
  eager: true,
});

const postFiles = import.meta.glob("../../../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function site() {
  const papersYaml = Object.values(paperFiles).find(
    (value): value is string => typeof value === "string",
  );
  if (!papersYaml) throw new Error("[content] data/papers.yaml tidak ada");
  const posts = Object.entries(postFiles)
    .flatMap(([file, text]) => {
      const name = file.split("/").pop();
      return typeof text === "string" && name ? [{ name, text }] : [];
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return buildSiteFromSources(
    { papersYaml, posts },
    { tools, courses },
    {
      includeDrafts: process.env.VERCEL_ENV === "preview",
    },
  );
}

function toCard(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  topics: string[];
  draft?: boolean;
}): PostCard {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    topics: post.topics,
    draft: post.draft === true,
  };
}

export function blogIndex(): { topics: TopicCard[]; posts: PostCard[] } {
  const graph = site();
  return {
    topics: graph.topics.map((topic) => ({
      slug: topic.slug,
      name: topic.name,
      blurb: topic.blurb,
      postCount: graph.posts.filter((post) => post.topics.includes(topic.slug)).length,
    })),
    posts: graph.posts.map(toCard),
  };
}

export function postBySlug(slug: string) {
  const graph = site();
  const post = graph.posts.find((item) => item.slug === slug);
  if (!post) return null;
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    draft: post.draft,
    html: post.html,
    topics: post.topics.map((slugName) => {
      const topic = topicBySlug(slugName);
      return { slug: slugName, name: topic?.name ?? slugName };
    }),
    papers: post.papers.map((paper) => ({
      id: paper.id,
      title: paper.title,
      year: paper.year,
      venue: paper.venue,
      kind: paper.kind,
      href: paper.href,
      authors: paper.authors,
      doi: paper.doi,
      summary: paper.summary,
      verified: paper.verified,
      status: paper.status,
    })),
    tools: post.tools,
    courses: post.courses,
    related: post.related.map(toCard),
    lean: post.lean,
    ogImage: post.ogImage,
  };
}

export function topicPage(slug: string) {
  const topic = topicBySlug(slug);
  if (!topic) return null;
  const graph = site();
  return {
    slug: topic.slug,
    name: topic.name,
    blurb: topic.blurb,
    posts: graph.posts.filter((post) => post.topics.includes(topic.slug)).map(toCard),
    papers: graph.papers
      .filter((paper) => paper.topics.includes(topic.slug))
      .map((paper) => ({
        id: paper.id,
        title: paper.title,
        year: paper.year,
        venue: paper.venue,
        href: paper.href,
        doi: paper.doi,
        posts: paper.posts,
      })),
    tools: graph.tools
      .filter((tool) => tool.topics.includes(topic.slug))
      .map((tool) => ({
        id: tool.id,
        title: tool.title,
        href: tool.href,
        appUrl: tool.appUrl,
      })),
  };
}

export function papersPage() {
  const graph = site();
  return {
    papers: graph.papers.map((paper) => ({
      id: paper.id,
      title: paper.title,
      year: paper.year,
      venue: paper.venue,
      kind: paper.kind,
      href: paper.href,
      authors: paper.authors,
      doi: paper.doi,
      summary: paper.summary,
      topics: paper.topics,
      status: paper.status,
      posts: paper.posts,
    })),
  };
}

export function postsByTool() {
  const graph = site();
  const map: Record<string, { slug: string; title: string }[]> = {};
  for (const tool of graph.tools) map[tool.id] = tool.posts;
  return { postsByTool: map };
}

export function postsByCourse() {
  const graph = site();
  const map: Record<string, { slug: string; title: string }[]> = {};
  for (const course of graph.courses) map[course.id] = course.posts;
  return { postsByCourse: map };
}

export function rssXml() {
  return renderRss(site());
}
