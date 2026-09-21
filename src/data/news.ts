/**
 * News — spotlight for the CURRENT YEAR.
 *
 * Works (papers, books, chapters) come from `works.ts` (single source of truth).
 * Activities (workshops, visits, etc.) stay here as curated extras.
 *
 * Update flow (SOP):
 * 1. Add / update entries in `src/data/works.ts` (prefer DOI hrefs).
 * 2. Optional: add `newsActivities` below when you took part in an event.
 * 3. Home News auto-picks current-year works + activities.
 * 4. Optional ORCID check: `node scripts/orcid-check.mjs` (prints public works
 *    missing from works.ts — review before pasting; do not invent DOIs).
 */

import {
  authorRoleFromAuthors,
  getWorksSorted,
  type WorkItem,
  type WorkKind,
} from "@/data/works";

export type NewsKind = "paper" | "article" | "book" | "chapter" | "activity";

export type NewsSource =
  | "orcid"
  | "outlook-news"
  | "outlook-task"
  | "manual"
  | "works";

export type NewsItem = {
  /** ISO date for sorting (YYYY-MM-DD). Newer = higher priority. */
  date: string;
  title: string;
  kind: NewsKind;
  venue: string;
  /** Publication / activity year as shown (e.g. "2026") */
  year: string;
  authors?: string;
  href: string;
  /** Provenance — ORCID works, Outlook News/Task, works archive, or manual */
  source?: NewsSource;
};

/**
 * Participated activities only (not publications).
 * Publications are derived from works.ts for the current calendar year.
 */
export const newsActivities: NewsItem[] = [
  // Example shape (keep empty until a real, approved activity):
  // {
  //   date: "2026-03-01",
  //   title: "…",
  //   kind: "activity",
  //   venue: "…",
  //   year: "2026",
  //   href: "https://…",
  //   source: "manual",
  // },
];

const WORK_NEWS_KINDS = new Set<WorkKind>([
  "paper",
  "article",
  "book",
  "chapter",
]);

function workToNews(work: WorkItem): NewsItem | null {
  if (!WORK_NEWS_KINDS.has(work.kind)) return null;
  const date = work.date ?? `${work.year}-01-01`;
  return {
    date,
    title: work.title,
    kind: work.kind as Exclude<NewsKind, "activity">,
    venue: work.venue,
    year: work.year,
    authors: work.authors,
    href: work.href,
    source: "works",
  };
}

export function currentNewsYear(now = new Date()): string {
  return String(now.getFullYear());
}

/** All items for the running calendar year, newest first. */
export function getLatestNews(now = new Date()): NewsItem[] {
  const y = currentNewsYear(now);
  const fromWorks = getWorksSorted()
    .filter((w) => w.year === y)
    .map(workToNews)
    .filter((n): n is NewsItem => n !== null);

  const activities = newsActivities.filter((item) => item.year === y);

  return [...fromWorks, ...activities].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}

/** Home spotlight — newest N items (works + activities), default 3. */
export function getNewsSpotlight(limit = 3, now = new Date()): NewsItem[] {
  return getLatestNews(now).slice(0, Math.max(0, limit));
}

/** Re-export for callers that badge author roles on news rows. */
export { authorRoleFromAuthors };
