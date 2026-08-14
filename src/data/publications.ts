/**
 * Books and longer-form writing for the Publications section.
 * Peer-reviewed papers: see News (current year) and Research / Google Scholar.
 *
 * Order: newest first → oldest last.
 * Covers: /public/covers/*.jpg — all 480×720 (2:3).
 */
export type PublicationItem = {
  title: string;
  kind: "book" | "article";
  venue: string;
  year?: string;
  summary: string;
  href: string;
  cover?: string;
};

export const publications: PublicationItem[] = [
  {
    title:
      "Research Companion to Advances in the Construction Industry in the Global South",
    kind: "book",
    venue: "Edward Elgar · Elgar Companions to the Built Environment",
    year: "2026",
    summary:
      "An edited research companion on construction in the Global South (series editor George Ofori) — advances, challenges, and practice across regions.",
    href: "https://www.elgaronline.com/edcollbook/book/9781035349029/9781035349029.xml",
    cover: "/covers/elgar-global-south.jpg",
  },
  {
    title:
      "Manajemen Operasi Konstruksi untuk Peningkatan Kinerja Proyek Konstruksi di Indonesia",
    kind: "book",
    venue: "FGB ITB · ITB Press",
    year: "2024",
    summary:
      "On construction operations management for improving project performance in Indonesia. ISBN 978-623-297-418-0 · e-ISBN 978-623-297-419-7 (PDF).",
    href: "https://www.itbpress.id/orasi-ilmiah/#flipbook-df_18718/1/",
    cover: "/covers/manajemen-operasi-konstruksi.jpg",
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
    cover: "/covers/seni-filosofi-lean.jpg",
  },
  {
    title: "Construction: Industry, Management & Engineering — 2nd Edition",
    kind: "book",
    venue: "ITB Press",
    year: "2nd ed.",
    summary:
      "A textbook for students and practitioners on the construction industry, management, and engineering. (Original title: Konstruksi: Industri, Pengelolaan dan Rekayasa.)",
    href: "https://www.itbpress.id/buku-gratis/#flipbook-df_41183/3",
    cover: "/covers/konstruksi-industri-ed2.jpg",
  },
];
