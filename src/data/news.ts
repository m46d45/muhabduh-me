/**
 * Latest news — papers, articles, books (e.g. newly indexed on Google Scholar).
 *
 * Rules:
 * - Put the newest item at the TOP of the array.
 * - Only the first 3 items are shown on the site (older ones “fall off”).
 * - Update this file when something new is published; then push to deploy.
 */
export type NewsItem = {
  /** ISO date for sorting (YYYY-MM-DD). Newer = higher priority. */
  date: string;
  title: string;
  /** paper | article | book */
  kind: "paper" | "article" | "book";
  /** Journal / venue / publisher (short) */
  venue: string;
  year: string;
  authors?: string;
  href: string;
};

/**
 * Newest first. Only NEWS_LIMIT items render.
 */
export const newsItems: NewsItem[] = [
  {
    date: "2026-01-15",
    title:
      "Introducing production system thinking into construction management education: a multi-level framework based on the Indonesian context",
    kind: "paper",
    venue: "International Journal of Construction Management",
    year: "2026",
    authors: "M Abduh, RD Wirahadikusumah, BW Soemardi, A Martina",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:MLfJN-KU85MC",
  },
  {
    date: "2026-01-10",
    title:
      "Evaluating the quality of publicly available construction technology data in Indonesia",
    kind: "paper",
    venue: "Construction Economics and Building",
    year: "2026",
    authors: "AT Putri, TK Chan, B Soemardi, M Abduh",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:tuHXwOkdijsC",
  },
  {
    date: "2026-01-05",
    title:
      "Pilot application of a sustainable and disaster-resilient infrastructure assessment framework: Evidence from Bandung, Indonesia",
    kind: "paper",
    venue: "Jàmbá: Journal of Disaster Risk Studies",
    year: "2026",
    authors: "A Firdaus, KS Pribadi, M Abduh, SA Sagala",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:lmc2jWPfTJgC",
  },
  // Older items below stay in the file for history, but will not appear until
  // they are among the top 3 by date. Example (hidden while the three above exist):
  // {
  //   date: "2025-06-01",
  //   title: "…",
  //   kind: "paper",
  //   venue: "…",
  //   year: "2025",
  //   href: "https://scholar.google.com/…",
  // },
];

export const NEWS_LIMIT = 3;

export function getLatestNews(limit = NEWS_LIMIT): NewsItem[] {
  return [...newsItems]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, limit);
}
