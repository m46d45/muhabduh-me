/**
 * Books and longer-form writing for the Publications section.
 * Peer-reviewed papers: see News (latest 3) and Research / Google Scholar.
 *
 * Order: newest first → oldest last.
 */
export type PublicationItem = {
  title: string;
  kind: "book" | "article";
  /** Publisher, journal, or series */
  venue: string;
  year?: string;
  summary: string;
  href: string;
};

export const publications: PublicationItem[] = [
  {
    title:
      "Research Companion to Advances in the Construction Industry in the Global South",
    kind: "book",
    venue: "Edward Elgar · Elgar Companions to the Built Environment",
    year: "2025",
    summary:
      "An edited research companion on construction in the Global South (series editor George Ofori) — advances, challenges, and practice across regions.",
    href: "https://www.elgaronline.com/edcollbook/book/9781035349029/9781035349029.xml",
  },
  {
    title:
      "Seni dan Filosofi Konstruksi Ramping (The Art and Philosophy of Lean Construction)",
    kind: "book",
    venue: "Indonesian translation · original by Do, D. (2024)",
    year: "2024",
    summary:
      "Indonesian translation of Do’s The Art and Philosophy of Lean Construction — making lean construction ideas more accessible to Indonesian readers. Translator: M. Abduh.",
    href: "https://cdn1.site-media.eu/images/document/14668524/TheArtandPhilosophyofLeanConstruction-INA-01.pdf",
  },
  {
    title: "Construction: Industry, Management & Engineering — 2nd Edition",
    kind: "book",
    venue: "ITB Press",
    year: "2nd ed.",
    summary:
      "A textbook for students and practitioners on the construction industry, management, and engineering. (Original title: Konstruksi: Industri, Pengelolaan dan Rekayasa.)",
    href: "https://www.itbpress.id/buku-gratis/#flipbook-df_41183/3",
  },
];
