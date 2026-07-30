import { ArrowUpRight, BookOpen } from "lucide-react";

const research = [
  {
    title: "Indonesian contractors’ readiness towards lean construction",
    venue: "IGLC · 14th Annual Conference",
    year: "2006",
    description:
      "An early study on how Indonesian contractors understood and prepared for lean construction practice.",
    href: "https://iglc.net/Papers/Details/402",
  },
  {
    title:
      "Green construction assessment model for Indonesian government projects",
    venue: "IGLC · 22nd Annual Conference",
    year: "2014",
    description:
      "A proposed assessment model to support more sustainable practice on government construction projects in Indonesia.",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:wbdj-CoPYUoC",
  },
  {
    title: "Lean construction adoption in Indonesia and Australia",
    venue: "IGLC · TOE framework study",
    year: "Recent",
    description:
      "A comparative look at lean construction adoption using the Technology–Organization–Environment framework.",
    href: "https://iglc.net/papers/Details/2382",
  },
  {
    title: "Research agenda 2025–2027",
    venue: "Personal research roadmap",
    year: "2025–27",
    description:
      "Themes I hope to keep working on: construction management, lean practice, and related systems questions.",
    href: "https://sway.cloud.microsoft/wWEXS6mhOhX3RLEL?ref=Link",
  },
];

const interests = [
  "Lean Construction",
  "Sustainable Construction",
  "Construction Supply Chains",
  "Construction Operations",
  "IT in Construction",
  "Productivity Improvement",
];

export function Research() {
  return (
    <section
      id="research"
      className="section-pad border-t border-border py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Research
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Questions I keep returning to
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Selected papers and notes on lean, sustainability, and construction
            systems. A fuller list is on{" "}
            <a
              href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              Google Scholar
            </a>
            .
          </p>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {interests.map((item) => (
            <li key={item}>
              <span className="inline-flex rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-ink">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <ul className="mt-10 space-y-4">
          {research.map((item) => (
            <li key={item.title}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:flex-row sm:items-start sm:gap-6 sm:p-7"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-teal-wash text-accent">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-xs tabular-nums text-subtle">
                      {item.year}
                    </span>
                    <span className="text-xs text-subtle">{item.venue}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
                <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-subtle transition-colors group-hover:text-accent sm:mt-1 sm:block" />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline underline-offset-2"
          >
            Publications on Google Scholar
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://www.scopus.com/authid/detail.uri?authorId=55584791103"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline underline-offset-2"
          >
            Scopus profile
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
