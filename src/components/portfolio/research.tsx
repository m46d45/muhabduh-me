import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Compass, Eye } from "lucide-react";
import { fetchCount, formatCount } from "@/lib/counter";
import { recordLinkClick } from "@/components/portfolio/link-stats";

const research = [
  {
    id: "lean-dc-indonesia-2026",
    title: "Lean construction in developing countries: the case of Indonesia",
    venue:
      "Research Companion to Advances in the Construction Industry in the Global South",
    year: "2026",
    description:
      "A chapter on how lean construction has been understood and practised in Indonesia, written for an international companion on the Global South.",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:k8Z6L05lTy4C",
  },
  {
    id: "production-thinking-education-2026",
    title:
      "Introducing production system thinking into construction management education: a multi-level framework based on the Indonesian context",
    venue: "International Journal of Construction Management",
    year: "2026",
    description:
      "A framework for bringing production-system thinking into construction management education, grounded in Indonesian classrooms and practice.",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:MLfJN-KU85MC",
  },
  {
    id: "lean-small-contractors-2026",
    title:
      "Revealing Lean-aligned practices in Indonesian small contractors: a preliminary study",
    venue: "IGLC · 34th Annual Conference",
    year: "2026",
    description:
      "A preliminary look at practices among Indonesian small contractors that already align with lean ideas, even when they are not labelled as such.",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:kz9GbA2Ns4gC",
  },
  {
    id: "tech-data-quality-2026",
    title:
      "Evaluating the quality of publicly available construction technology data in Indonesia",
    venue: "Construction Economics and Building",
    year: "2026",
    description:
      "A look at how reliable publicly available construction-technology data in Indonesia actually is, and what that means for research and policy.",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:tuHXwOkdijsC",
  },
  {
    id: "lcc-fuzzy-delphi-2026",
    title:
      "Selecting Life Cycle Cost Indicators for Sustainable Public Procurement: A Fuzzy Delphi Consensus from Indonesia",
    venue: "Sustainability",
    year: "2026",
    description:
      "A Fuzzy Delphi study toward life-cycle cost indicators that can support more sustainable public procurement in Indonesia.",
    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=DctmufgAAAAJ&citation_for_view=DctmufgAAAAJ:VaXvl8Fpj5cC",
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
            Themes, selected recent papers from Google Scholar, and notes. The
            full list for this year also appears under{" "}
            <a
              href="#news"
              className="text-accent underline-offset-2 hover:underline"
            >
              News
            </a>
            ; a fuller list is on Google Scholar.
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
              Themes I hope to keep exploring — construction management, lean
              practice, and related systems questions.
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

        <ul className="mt-10 space-y-4">
          {research.map((item) => (
            <li key={item.id}>
              <TrackedCard
                trackId={`research-paper-${item.id}`}
                href={item.href}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:flex-row sm:flex-wrap sm:items-start sm:gap-6 sm:p-7"
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
              </TrackedCard>
            </li>
          ))}
        </ul>

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
