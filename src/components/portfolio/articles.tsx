import { ArrowUpRight } from "lucide-react";

const articles = [
  {
    title: "Construction: Industry, Management & Engineering — 2nd Edition",
    date: "Book",
    reading: "ITB Press",
    summary:
      "Textbook and reference on the construction industry, management, and engineering — updated edition for students and practitioners. (Original title: Konstruksi: Industri, Pengelolaan dan Rekayasa.)",
    href: "https://www.itbpress.id/buku-gratis/#flipbook-df_41183/3",
  },
  {
    title: "Research Topics 2025–2027",
    date: "Agenda",
    reading: "Research roadmap",
    summary:
      "Personal research themes for the coming years — construction management, lean practice, and related systems questions.",
    href: "https://sway.cloud.microsoft/wWEXS6mhOhX3RLEL?ref=Link",
  },
  {
    title: "Curriculum Vitae — Muhamad Abduh, Ph.D.",
    date: "CV",
    reading: "Full profile",
    summary:
      "Complete curriculum vitae with academic history, publications, and professional service.",
    href: "https://bit.ly/BioMAIndonesia",
  },
  {
    title: "Photos for media",
    date: "Media",
    reading: "Press kit",
    summary:
      "Official photographs available for media, invitations, and institutional use.",
    href: "https://itbdsti-my.sharepoint.com/:f:/g/personal/abduh_itb_ac_id/IgA-gX8rVSybToQJ1AGVwmGBAXhfgIrRto_M3Q9aknVxoDs?e=yKpbPt",
  },
];

export function Articles() {
  return (
    <section
      id="articles"
      className="section-pad border-t border-border bg-bg-deep/40 py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Publications
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Books, CV, and public materials
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Selected resources from my public profile — books, research agenda,
            CV, and media assets. Peer-reviewed papers are listed under Research
            and on Google Scholar.
          </p>
        </div>

        <ul className="mt-12 divide-y divide-border border-y border-border">
          {articles.map((article) => (
            <li key={article.title}>
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 py-6 transition-colors sm:flex-row sm:items-start sm:justify-between sm:gap-10 sm:py-7"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle">
                    <span className="font-mono tabular-nums">{article.date}</span>
                    <span aria-hidden>·</span>
                    <span>{article.reading}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-xl">
                    {article.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    {article.summary}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors group-hover:text-accent sm:mt-6 sm:shrink-0">
                  Open
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
