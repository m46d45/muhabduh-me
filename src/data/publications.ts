/**
 * Books and longer-form writing for the Publications section.
 * Peer-reviewed papers: see News (latest 3) and Research / Google Scholar.
 *
 * Add new books at the top when you share them.
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
    title: "Construction: Industry, Management & Engineering — 2nd Edition",
    kind: "book",
    venue: "ITB Press",
    year: "2nd ed.",
    summary:
      "A textbook for students and practitioners on the construction industry, management, and engineering. (Original title: Konstruksi: Industri, Pengelolaan dan Rekayasa.)",
    href: "https://www.itbpress.id/buku-gratis/#flipbook-df_41183/3",
  },
  // Add more books / selected articles here (newest first if you like):
  // {
  //   title: "…",
  //   kind: "book",
  //   venue: "…",
  //   year: "20XX",
  //   summary: "…",
  //   href: "https://…",
  // },
];
