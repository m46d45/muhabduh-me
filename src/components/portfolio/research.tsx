import { useEffect, useState } from "react";
import { ArrowUpRight, Compass, Eye, FlaskConical } from "lucide-react";
import { fetchCount, formatCount } from "@/lib/counter";
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
};

/** Work in progress this year. Newest / current grants first. */
export const currentStudies: CurrentStudy[] = [
  {
    id: "kurikulum-s1-mk-2026",
    title:
      "Model Kurikulum Program Sarjana Manajemen Konstruksi Multidisiplin di Indonesia",
    note: "PPMI ITB, 2026 · Muhamad Abduh. A curriculum model for a multidisciplinary undergraduate programme in construction management.",
  },
  {
    id: "disaster-resiliency-infra-2026",
    title:
      "Mainstreaming Disaster Resiliency in Infrastructure Systems: Research and Education",
    note: "PPMI ITB, 2026 · Reini Wirahadikusumah, Muhamad Abduh, Patria Kusumaningrum, Eliza Rosmaya Puri, Sri Suryani. Bringing disaster resiliency into infrastructure research and teaching.",
  },
  {
    id: "lean-small-contractors-equity-2025-26",
    title:
      "Prinsip dan Metode Konstruksi Ramping untuk Kontraktor Kecil di Indonesia",
    note: "Equity ITB, 2025–2026 · Muhamad Abduh. Lean construction principles and methods for small contractors in Indonesia.",
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

function ClickLine({ count }: { count: number | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-deep/80 px-2.5 py-1 text-xs text-muted">
      <Eye className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
      {count === null ? (
        <span className="font-mono tabular-nums">…</span>
      ) : (
        <>
          <span className="font-mono tabular-nums font-medium text-ink">
            {formatCount(count)}
          </span>
          <span>clicks</span>
        </>
      )}
    </span>
  );
}

function TrackedCard({
  trackId,
  href,
  children,
  className,
}: {
  trackId: string;
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [clicks, setClicks] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchCount(`click-${trackId}`, "get").then((n) => {
      if (!cancelled) setClicks(n ?? 0);
    });
    return () => {
      cancelled = true;
    };
  }, [trackId]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={async () => {
        const n = await recordLinkClick(trackId);
        if (n !== null) setClicks(n);
      }}
      className={className}
    >
      {children}
      <div className="mt-3 w-full sm:col-span-full">
        <ClickLine count={clicks} />
      </div>
    </a>
  );
}

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
            Work in progress, {year}
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Studies I am in the middle of this year — not yet a publication
            list. Papers that have appeared go under{" "}
            <a
              href="#news"
              className="text-accent underline-offset-2 hover:underline"
            >
              News
            </a>{" "}
            and Google Scholar.
          </p>
        </div>

        <TrackedCard
          trackId="research-topics-2025-27"
          href="https://sway.cloud.microsoft/wWEXS6mhOhX3RLEL?ref=Link"
          className="group mt-10 flex flex-col gap-4 rounded-xl border border-accent/25 bg-teal-wash/40 p-6 shadow-soft transition-colors hover:border-accent/45 sm:flex-row sm:flex-wrap sm:items-start sm:gap-6 sm:p-7"
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
        </TrackedCard>

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
                {item.href ? (
                  <TrackedCard
                    trackId={`research-current-${item.id}`}
                    href={item.href}
                    className="group flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:flex-row sm:flex-wrap sm:items-start sm:gap-6 sm:p-7"
                  >
                    <StudyBody item={item} linked />
                  </TrackedCard>
                ) : (
                  <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-start sm:gap-6 sm:p-7">
                    <StudyBody item={item} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 rounded-xl border border-dashed border-border bg-surface/60 px-5 py-6 text-sm text-muted">
            A short list of {year} studies will sit here. Papers already out
            are kept under News, so the two sections stay distinct.
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-6">
          <ScholarFooterLink
            trackId="research-scholar-all"
            href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en"
            label="Publications on Google Scholar"
          />
          <ScholarFooterLink
            trackId="research-scopus"
            href="https://www.scopus.com/authid/detail.uri?authorId=55584791103"
            label="Scopus profile"
          />
        </div>
      </div>
    </section>
  );
}

function StudyBody({
  item,
  linked,
}: {
  item: CurrentStudy;
  linked?: boolean;
}) {
  return (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-teal-wash text-accent">
        <FlaskConical className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <h3
          className={`font-display text-lg font-semibold tracking-tight text-ink ${
            linked ? "transition-colors group-hover:text-accent" : ""
          }`}
        >
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p>
      </div>
      {linked && (
        <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-subtle transition-colors group-hover:text-accent sm:mt-1 sm:block" />
      )}
    </>
  );
}

function ScholarFooterLink({
  trackId,
  href,
  label,
}: {
  trackId: string;
  href: string;
  label: string;
}) {
  const [clicks, setClicks] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchCount(`click-${trackId}`, "get").then((n) => {
      if (!cancelled) setClicks(n ?? 0);
    });
    return () => {
      cancelled = true;
    };
  }, [trackId]);

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={async () => {
          const n = await recordLinkClick(trackId);
          if (n !== null) setClicks(n);
        }}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline underline-offset-2"
      >
        {label}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
      <ClickLine count={clicks} />
    </span>
  );
}
