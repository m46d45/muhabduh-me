/**
 * Growable works / publications archive.
 * Seeded from news.ts (current-year papers), books in publications.ts,
 * and ORCID highlights (orcid-works-summary.json). Do not invent DOIs.
 *
 * authorRole: first if authors start with M Abduh / sole Abduh; co otherwise
 * when Abduh appears later. Omit when authors unknown.
 */

export type WorkKind =
  | "paper"
  | "chapter"
  | "conference"
  | "book"
  | "article";

export type AuthorRole = "first" | "co";

export type WorkItem = {
  year: string;
  title: string;
  venue: string;
  href: string;
  kind: WorkKind;
  authorRole?: AuthorRole;
  authors?: string;
  /** Optional ISO date for finer sorting within a year */
  date?: string;
  doi?: string;
};

export function authorRoleFromAuthors(
  authors?: string,
): AuthorRole | undefined {
  if (!authors?.trim()) return undefined;
  const first = authors.split(",")[0]?.trim() ?? "";
  if (/^M\.?\s*Abduh\b/i.test(first) || /^Muhamad\s+Abduh\b/i.test(first)) {
    return "first";
  }
  if (/\bAbduh\b/i.test(authors)) return "co";
  return undefined;
}

function doiHref(doi: string): string {
  return `https://doi.org/${doi}`;
}

/** Seeded archive — newest first. Deduped by title+year. */
export const works: WorkItem[] = [
  // —— 2026 from news.ts (venues + authors known) ——
  {
    date: "2026-08-30",
    year: "2026",
    title:
      "Readiness for sensing technologies and data analytics in multi-hazard disaster risk reduction: a case study from Greater Bandung, Indonesia",
    kind: "paper",
    venue: "Sustainable and Resilient Infrastructure",
    authors:
      "RD Wirahadikusumah, M Abduh, P Kusumaningrum, D Apoji, MA Viqolbi, I Amalia",
    authorRole: "co",
    href: "https://doi.org/10.1080/23789689.2026.2723803",
    doi: "10.1080/23789689.2026.2723803",
  },
  {
    date: "2026-07-21",
    year: "2026",
    title: "Lean construction in developing countries: the case of Indonesia",
    kind: "chapter",
    venue:
      "Research Companion to Advances in the Construction Industry in the Global South",
    authors: "M Abduh",
    authorRole: "first",
    href: "https://doi.org/10.4337/9781035349029.00029",
    doi: "10.4337/9781035349029.00029",
  },
  {
    date: "2026-01-15",
    year: "2026",
    title:
      "Introducing production system thinking into construction management education: a multi-level framework based on the Indonesian context",
    kind: "paper",
    venue: "International Journal of Construction Management",
    authors: "M Abduh, RD Wirahadikusumah, BW Soemardi, A Martina",
    authorRole: "first",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:MLfJN-KU85MC",
  },
  {
    date: "2026-01-14",
    year: "2026",
    title:
      "Revealing Lean-aligned practices in Indonesian small contractors: a preliminary study",
    kind: "paper",
    venue: "IGLC · 34th Annual Conference",
    authors: "M Abduh, B Hasiholan, E Puri, A Wirdianto, H Linas, P Nainggolan",
    authorRole: "first",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:kz9GbA2Ns4gC",
  },
  {
    date: "2026-01-12",
    year: "2026",
    title:
      "Evaluating the quality of publicly available construction technology data in Indonesia",
    kind: "paper",
    venue: "Construction Economics and Building",
    authors: "AT Putri, TK Chan, B Soemardi, M Abduh",
    authorRole: "co",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:tuHXwOkdijsC",
  },
  {
    date: "2026-01-08",
    year: "2026",
    title:
      "Selecting Life Cycle Cost Indicators for Sustainable Public Procurement: A Fuzzy Delphi Consensus from Indonesia",
    kind: "paper",
    venue: "Sustainability",
    authors: "DS Panjaitan, A Cakravastia, YA Hidayat, M Abduh",
    authorRole: "co",
    href: doiHref("10.3390/su18157560"),
    doi: "10.3390/su18157560",
  },
  {
    date: "2026-01-05",
    year: "2026",
    title:
      "Pilot application of a sustainable and disaster-resilient infrastructure assessment framework: Evidence from Bandung, Indonesia",
    kind: "paper",
    venue: "Jàmbá: Journal of Disaster Risk Studies",
    authors: "A Firdaus, KS Pribadi, M Abduh, SA Sagala",
    authorRole: "co",
    href: doiHref("10.4102/JAMBA.v18i1.2034"),
    doi: "10.4102/JAMBA.v18i1.2034",
  },

  // —— ORCID highlights (older; DOI only when present; no invented authors) ——
  {
    year: "2025",
    title:
      "Rehabilitation and reconstruction cost drivers in earthquake-affected buildings: a damage-level-based analysis in Indonesia",
    kind: "paper",
    venue: "Bulletin of Earthquake Engineering",
    href: doiHref("10.1007/s10518-025-02243-5"),
    doi: "10.1007/s10518-025-02243-5",
  },
  {
    year: "2024",
    title:
      "Development of a Building Repair Time Component for the Disaster Losses Estimate in the Mamuju Earthquake",
    kind: "chapter",
    venue: "CIGOS 2024 · Lecture Notes in Civil Engineering",
    href: doiHref("10.1007/978-981-97-1972-3_157"),
    doi: "10.1007/978-981-97-1972-3_157",
  },
  {
    year: "2023",
    title:
      "Promoting Humanitarian Engineering Approaches for Earthquake-Resilient Housing in Indonesia",
    kind: "chapter",
    venue: "IGI Global",
    href: doiHref("10.4018/978-1-6684-5619-4.ch012"),
    doi: "10.4018/978-1-6684-5619-4.ch012",
  },
  {
    year: "2020",
    title:
      "The study of sustainable procurement in the procurement of ready mixed concrete supplier",
    kind: "conference",
    venue: "IOP Conference Series: Earth and Environmental Science",
    href: doiHref("10.1088/1755-1315/520/1/012004"),
    doi: "10.1088/1755-1315/520/1/012004",
  },
  {
    year: "2020",
    title: "Technology Assessment in Indonesian Construction Industry",
    kind: "conference",
    venue: "IOP Conference Series: Materials Science and Engineering",
    href: doiHref("10.1088/1757-899X/849/1/012077"),
    doi: "10.1088/1757-899X/849/1/012077",
  },
  {
    year: "2020",
    title:
      "Small-sized contractors' strategies of construction material purchasing in road rehabilitation projects",
    kind: "conference",
    venue: "IOP Conference Series: Materials Science and Engineering",
    href: doiHref("10.1088/1757-899X/933/1/012025"),
    doi: "10.1088/1757-899X/933/1/012025",
  },
  {
    year: "2020",
    title:
      "Analysis of NATM tunneling method using CYCLONE modeling and simulation tools",
    kind: "conference",
    venue: "IOP Conference Series: Materials Science and Engineering",
    href: doiHref("10.1088/1757-899X/933/1/012002"),
    doi: "10.1088/1757-899X/933/1/012002",
  },
  {
    year: "2019",
    title:
      "Purchasing Strategy of Small-sized Contractors for Building Projects in the Greater Bandung Areas",
    kind: "conference",
    venue: "IOP Conference Series: Materials Science and Engineering",
    href: doiHref("10.1088/1757-899X/650/1/012004"),
    doi: "10.1088/1757-899X/650/1/012004",
  },
  {
    year: "2019",
    title:
      "Introducing sustainability principles into the procurement of construction works–case of Indonesian developers",
    kind: "paper",
    venue: "International Journal of Construction Management",
    href: doiHref("10.1080/15623599.2019.1599559"),
    doi: "10.1080/15623599.2019.1599559",
  },
  {
    year: "2018",
    title:
      "Framework Development Methodology for Sustainable Procurement of Construction Works in Indonesia",
    kind: "conference",
    venue: "MATEC Web of Conferences",
    href: doiHref("10.1051/matecconf/201820302014"),
    doi: "10.1051/matecconf/201820302014",
  },
  {
    year: "2017",
    title:
      "The Sustainable Infrastructure through the Construction Supply Chain Carbon Footprint Approach",
    kind: "conference",
    venue: "Procedia Engineering",
    href: doiHref("10.1016/j.proeng.2017.01.339"),
    doi: "10.1016/j.proeng.2017.01.339",
  },
  {
    year: "2017",
    title: "Simulation of tunneling construction methods of the Cisumdawu toll road",
    kind: "conference",
    venue: "AIP Conference Proceedings",
    href: doiHref("10.1063/1.5011583"),
    doi: "10.1063/1.5011583",
  },
  {
    year: "2015",
    title:
      "Identification of source factors of carbon dioxide (CO2) emissions in concreting of reinforced concrete",
    kind: "conference",
    venue: "Procedia Engineering",
    href: doiHref("10.1016/j.proeng.2015.11.107"),
    doi: "10.1016/j.proeng.2015.11.107",
  },
  {
    year: "2012",
    title:
      "Indonesian construction supply chains cost structure and factors: A case study of two projects",
    kind: "paper",
    venue: "Journal of Civil Engineering and Management",
    authors: "M Abduh, BW Soemardi, RD Wirahadikusumah",
    authorRole: "first",
    href: doiHref("10.3846/13923730.2012.671259"),
    doi: "10.3846/13923730.2012.671259",
  },
  {
    year: "2004",
    title: "Electronic Networking Technologies in construction",
    kind: "paper",
    venue: "Journal of Construction Research",
    authors: "M Abduh, MJ Skibniewski",
    authorRole: "first",
    href: doiHref("10.1142/S1609945104000036"),
    doi: "10.1142/S1609945104000036",
  },
  {
    year: "2003",
    title:
      "Utility assessment of electronic networking technologies for design-build projects",
    kind: "paper",
    venue: "Automation in Construction",
    authors: "M Abduh, MJ Skibniewski",
    authorRole: "first",
    href: doiHref("10.1016/S0926-5805(02)00042-0"),
    doi: "10.1016/S0926-5805(02)00042-0",
  },
  {
    year: "2002",
    title:
      "Optimal configuration of electronic networking technologies for supporting d/b projects",
    kind: "paper",
    venue: "Journal of Civil Engineering and Management",
    authors: "M Abduh, MJ Skibniewski",
    authorRole: "first",
    href: doiHref("10.1080/13923730.2002.10531284"),
    doi: "10.1080/13923730.2002.10531284",
  },
];

export function getWorksSorted(): WorkItem[] {
  return [...works].sort((a, b) => {
    if (a.year !== b.year) return Number(b.year) - Number(a.year);
    const ad = a.date ?? `${a.year}-01-01`;
    const bd = b.date ?? `${b.year}-01-01`;
    return ad < bd ? 1 : ad > bd ? -1 : 0;
  });
}

/** Distinct years newest-first for filter UI */
export function workYears(): string[] {
  return [...new Set(getWorksSorted().map((w) => w.year))];
}
