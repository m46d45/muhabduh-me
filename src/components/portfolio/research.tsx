import { ArrowUpRight, Compass, FlaskConical } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { recordLinkClick } from "@/components/portfolio/link-stats";

/**
 * Ongoing work for the current calendar year — not published papers
 * (those live under News / Scholar). Fill this list when new lines of
 * work start; older years are simply left out.
 */
export type CurrentStudy = {
  id: string;
  title: string;
  note: string;
  href?: string;
  /** Optional light fields when known */
  status?: string;
  funder?: string;
  collaborators?: string;
};

/** Work in progress this year. Newest / current grants first. */
export const currentStudies: CurrentStudy[] = [
  {
    id: "kurikulum-s1-mk-2026",
    title:
      "Model Kurikulum Program Sarjana Manajemen Konstruksi Multidisiplin di Indonesia",
    note: "A curriculum model for a multidisciplinary undergraduate programme in construction management.",
    status: "In progress",
    funder: "PPMI ITB, 2026",
    collaborators: "Muhamad Abduh",
  },
  {
    id: "disaster-resiliency-infra-2026",
    title:
      "Mainstreaming Disaster Resiliency in Infrastructure Systems: Research and Education",
    note: "Bringing disaster resiliency into infrastructure research and teaching.",
    status: "In progress",
    funder: "PPMI ITB, 2026",
    collaborators:
      "Reini Wirahadikusumah, Muhamad Abduh, Patria Kusumaningrum, Eliza Rosmaya Puri, Sri Suryani",
  },
  {
    id: "lean-small-contractors-equity-2025-26",
    title:
      "Prinsip dan Metode Konstruksi Ramping untuk Kontraktor Kecil di Indonesia",
    note: "Lean construction principles and methods for small contractors in Indonesia.",
    status: "In progress",
    funder: "Equity ITB, 2025–2026",
    collaborators: "Muhamad Abduh",
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
  const year = String(new Date().getFullYear());

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
            Current studies, {year}
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Studies I am in the middle of this year — not yet a publication
            list. Papers that have appeared go under{" "}
            <Link
              to="/publications"
              className="text-accent underline-offset-2 hover:underline"
            >
              Publications
            </Link>{" "}
            and Google Scholar.
          </p>
        </div>

        <a
          href="https://sway.cloud.microsoft/wWEXS6mhOhX3RLEL?ref=Link"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            void recordLinkClick("research-topics-2025-27");
          }}
          className="group mt-10 flex flex-col gap-4 rounded-xl border border-accent/25 bg-teal-wash/40 p-6 shadow-soft transition-colors hover:border-accent/45 sm:flex-row sm:items-start sm:gap-6 sm:p-7"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-accent/20 bg-surface text-accent">
            <Compass className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle">
              <span className="rounded-full border border-accent/25 bg-surface px-2 py-0.5 font-medium text-accent">
                Research topics
              </span>
              <span className="font-mono tabular-nums">2025–2027</span>
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
              Research topics 2025–2027
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Longer themes I hope to keep exploring — construction management,
              lean practice, and related systems questions.
            </p>
          </div>
          <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-subtle transition-colors group-hover:text-accent sm:mt-1 sm:block" />
        </a>

        <ul className="mt-8 flex flex-wrap gap-2">
          {interests.map((item) => (
            <li key={item}>
              <span className="inline-flex rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-ink">
                {item}
              </span>
            </li>
          ))}
        </ul>

        {currentStudies.length > 0 ? (
          <ul className="mt-10 space-y-4">
            {currentStudies.map((item) => (
              <li key={item.id}>
                <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-start sm:gap-6 sm:p-7">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-teal-wash text-accent">
                    <FlaskConical className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.note}
                    </p>
                    <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-subtle">
                      {item.status && (
                        <div>
                          <dt className="inline font-medium text-muted">
                            Status:{" "}
                          </dt>
                          <dd className="inline">{item.status}</dd>
                        </div>
                      )}
                      {item.funder && (
                        <div>
                          <dt className="inline font-medium text-muted">
                            Funder:{" "}
                          </dt>
                          <dd className="inline">{item.funder}</dd>
                        </div>
                      )}
                      {item.collaborators && (
                        <div className="basis-full sm:basis-auto">
                          <dt className="inline font-medium text-muted">
                            Team:{" "}
                          </dt>
                          <dd className="inline">{item.collaborators}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 rounded-xl border border-dashed border-border bg-surface/60 px-5 py-6 text-sm text-muted">
            A short list of {year} studies will sit here.
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-6">
          <a
            href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              void recordLinkClick("research-scholar-all");
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline underline-offset-2"
          >
            Publications on Google Scholar
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://orcid.org/0000-0001-6926-6665"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              void recordLinkClick("research-orcid");
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline underline-offset-2"
          >
            ORCID
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://www.scopus.com/authid/detail.uri?authorId=55584791103"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              void recordLinkClick("research-scopus");
            }}
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
