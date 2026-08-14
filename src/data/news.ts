/**
 * News — papers / articles / books from Google Scholar for the CURRENT YEAR.
 *
 * Rules:
 * - Newest first.
 * - Only items whose `year` matches the current calendar year are shown.
 * - When a new Scholar item appears, add it here and push.
 */
export type NewsItem = {
  /** ISO date for sorting (YYYY-MM-DD). Newer = higher priority. */
  date: string;
  title: string;
  kind: "paper" | "article" | "book" | "chapter";
  venue: string;
  /** Publication year as shown on Google Scholar (e.g. "2026") */
  year: string;
  authors?: string;
  href: string;
};

export const newsItems: NewsItem[] = [
  {
    date: "2026-07-21",
    title: "Lean construction in developing countries: the case of Indonesia",
    kind: "chapter",
    venue:
      "Research Companion to Advances in the Construction Industry in the Global South",
    year: "2026",
    authors: "M Abduh",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:k8Z6L05lTy4C",
  },
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
    date: "2026-01-14",
    title:
      "Revealing Lean-aligned practices in Indonesian small contractors: a preliminary study",
    kind: "paper",
    venue: "IGLC · 34th Annual Conference",
    year: "2026",
    authors: "M Abduh, B Hasiholan, E Puri, A Wirdianto, H Linas, P Nainggolan",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:kz9GbA2Ns4gC",
  },
  {
    date: "2026-01-12",
    title:
      "Evaluating the quality of publicly available construction technology data in Indonesia",
    kind: "paper",
    venue: "Construction Economics and Building",
    year: "2026",
    authors: "AT Putri, TK Chan, B Soemardi, M Abduh",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:tuHXwOkdijsC",
  },
  {
    date: "2026-01-08",
    title:
      "Selecting Life Cycle Cost Indicators for Sustainable Public Procurement: A Fuzzy Delphi Consensus from Indonesia",
    kind: "paper",
    venue: "Sustainability",
    year: "2026",
    authors: "DS Panjaitan, A Cakravastia, YA Hidayat, M Abduh",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:VaXvl8Fpj5cC",
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
];

export function currentNewsYear(now = new Date()): string {
  return String(now.getFullYear());
}

/** All items for the running calendar year, newest first. */
export function getLatestNews(now = new Date()): NewsItem[] {
  const y = currentNewsYear(now);
  return [...newsItems]
    .filter((item) => item.year === y)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
