export type TopicInfo = {
  slug: string;
  name: string;
  blurb: string;
};

export type PaperRecord = {
  id: string;
  title: string;
  year: string;
  venue: string;
  kind: string;
  href: string | null;
  authors: string | null;
  doi: string | null;
  summary: string | null;
  topics: string[];
  verified: boolean;
  status: string | null;
  posts: { slug: string; title: string }[];
};

export type PostRecord = {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft: boolean;
  topics: string[];
  paperIds: string[];
  toolIds: string[];
  courseIds: string[];
  html: string;
  papers: PaperRecord[];
  tools: { id: string; title: string; href: string; appUrl: string | null }[];
  courses: { id: string; title: string; href: string }[];
  related: {
    slug: string;
    title: string;
    description: string;
    date: string;
    topics: string[];
  }[];
  lean: boolean;
  ogImage: string;
};

export type SiteGraph = {
  siteUrl: string;
  topics: TopicInfo[];
  papers: PaperRecord[];
  posts: PostRecord[];
  tools: {
    id: string;
    title: string;
    href: string;
    appUrl: string | null;
    topics: string[];
    posts: { slug: string; title: string }[];
  }[];
  courses: {
    id: string;
    title: string;
    href: string;
    posts: { slug: string; title: string }[];
  }[];
  drafts: { slug: string; title: string }[];
};

export function topicBySlug(slug: string): TopicInfo | null;

export function buildSite(
  root: string,
  catalogs: {
    tools: { id: string; title: string; appUrl?: string; topics?: string[] }[];
    courses: { id: string; title: string; href: string }[];
  },
  options?: { includeDrafts?: boolean },
): SiteGraph;

export function renderRss(site: SiteGraph): string;

export function readPapers(root: string): PaperRecord[];

export function readPosts(root: string): PostRecord[];
