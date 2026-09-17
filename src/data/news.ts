/**
 * News — spotlight for the CURRENT YEAR.
 *
 * Content mix:
 * - Works (paper / article / book / chapter) — often from ORCID, curated here.
 * - Participated activities (kind: "activity") — e.g. workshops, visits, series
 *   you took part in. Not a dump of the full public calendar.
 *
 * Planned auto sources (wire later):
 * - ORCID → works
 * - Outlook category "News" → activity drafts
 * - Outlook Tasks tagged undangan/webinar (SOP H−2) → activity drafts
 * Flow: draft → approve once → publish (+ LinkedIn caption for works when SOP says so).
 *
 * Rules:
 * - Newest first.
 * - Only items whose `year` matches the current calendar year are shown.
 * - Do not invent activities; add them when real and approved.
 */
export type NewsKind = "paper" | "article" | "book" | "chapter" | "activity";

export type NewsSource =
  | "orcid"
  | "outlook-news"
  | "outlook-task"
  | "manual";

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
  /** Provenance — ORCID works, Outlook News/Task, or manual curation */
  source?: NewsSource;
};

export const newsItems: NewsItem[] = [
  {
    date: "2026-09-11",
    title: "Construction and Infrastructure Management in Indonesia (Volumes 1–2)",
    kind: "book",
    venue: "ITB Press",
    year: "2026",
    authors: "CIM research group, ITB (M Abduh, deputy editor)",
    href: "https://www.itbpress.id/buku-gratis/#flipbook-df_50498",
    source: "manual",
  },
  {
    date: "2026-08-30",
    title:
      "Readiness for sensing technologies and data analytics in multi-hazard disaster risk reduction: a case study from Greater Bandung, Indonesia",
    kind: "paper",
    venue: "Sustainable and Resilient Infrastructure",
    year: "2026",
    authors:
      "RD Wirahadikusumah, M Abduh, P Kusumaningrum, D Apoji, MA Viqolbi, I Amalia",
    href: "https://doi.org/10.1080/23789689.2026.2723803",
    source: "orcid",
  },
  {
    date: "2026-07-21",
    title: "Lean construction in developing countries: the case of Indonesia",
    kind: "chapter",
    venue:
      "Research Companion to Advances in the Construction Industry in the Global South",
    year: "2026",
    authors: "M Abduh",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:k8Z6L05lTy4C",
    source: "orcid",
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
    source: "orcid",
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
    source: "orcid",
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
    source: "orcid",
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
    source: "orcid",
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
    source: "orcid",
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

/** Home spotlight — newest N items (works + activities), default 3. */
export function getNewsSpotlight(limit = 3, now = new Date()): NewsItem[] {
  return getLatestNews(now).slice(0, Math.max(0, limit));
}
