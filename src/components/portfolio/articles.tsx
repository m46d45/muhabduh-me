import { useMemo, useState } from "react";
import { ArrowUpRight, BookMarked, FileText } from "lucide-react";
import { publications, type PublicationItem } from "@/data/publications";
import {
  getWorksSorted,
  workYears,
  type AuthorRole,
  type WorkItem,
} from "@/data/works";
import { recordLinkClick } from "@/components/portfolio/link-stats";

const kindLabel: Record<PublicationItem["kind"], string> = {
  book: "Book",
  article: "Article",
};

const workKindLabel: Record<WorkItem["kind"], string> = {
  paper: "Paper",
  chapter: "Chapter",
  conference: "Conference",
  book: "Book",
  article: "Article",
};

const kindIcon = {
  book: BookMarked,
  article: FileText,
} as const;

function RoleBadge({ role }: { role?: AuthorRole }) {
  if (!role) return null;
  return (
    <span
      className={
        role === "first"
          ? "rounded-full border border-accent/30 bg-teal-wash px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-accent"
          : "rounded-full border border-border bg-bg-deep px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-subtle"
      }
    >
      {role === "first" ? "First author" : "Co-author"}
    </span>
  );
}

function Cover({ item }: { item: PublicationItem }) {
  const Icon = kindIcon[item.kind];
  if (item.cover) {
    return (
      <img
        src={item.cover}
        alt={`Cover of ${item.title}`}
        width={96}
        height={144}
        className="h-36 w-24 shrink-0 rounded-sm object-cover shadow-soft ring-1 ring-border/80"
      />
    );
  }
  return (
    <span className="flex h-36 w-24 shrink-0 items-center justify-center rounded-sm border border-border bg-surface text-accent">
      <Icon className="h-5 w-5" />
    </span>
  );
}

function PubRow({ item }: { item: PublicationItem }) {
  const trackId = `pub-${item.kind}-${item.title
    .slice(0, 28)
    .replace(/\W+/g, "-")
    .toLowerCase()}`;

  return (
    <li>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          void recordLinkClick(trackId);
        }}
        className="group flex flex-col gap-4 py-6 transition-colors sm:flex-row sm:items-start sm:justify-between sm:gap-10 sm:py-7"
      >
        <div className="flex min-w-0 flex-1 gap-4 sm:gap-5">
          <Cover item={item} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle">
              <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-medium text-muted">
                {kindLabel[item.kind]}
              </span>
              {item.year && (
                <span className="font-mono tabular-nums">{item.year}</span>
              )}
              <span aria-hidden>·</span>
              <span>{item.venue}</span>
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-xl">
              {item.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {item.summary}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors group-hover:text-accent sm:mt-6 sm:shrink-0">
          Open
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </a>
    </li>
  );
}

function WorkRow({ item }: { item: WorkItem }) {
  const trackId = `work-${item.year}-${item.title
    .slice(0, 24)
    .replace(/\W+/g, "-")
    .toLowerCase()}`;

  return (
    <li>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          void recordLinkClick(trackId);
        }}
        className="group flex flex-col gap-2 border-t border-border py-4 transition-colors first:border-t-0 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
            <span className="font-mono tabular-nums text-muted">{item.year}</span>
            <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-medium text-muted">
              {workKindLabel[item.kind]}
            </span>
            <RoleBadge role={item.authorRole} />
            <span className="truncate">{item.venue}</span>
          </div>
          <h4 className="mt-1.5 font-display text-base font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
            {item.title}
          </h4>
          {item.authors && (
            <p className="mt-1 text-sm text-muted">{item.authors}</p>
          )}
        </div>
        <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-subtle transition-colors group-hover:text-accent sm:mt-1 sm:block" />
      </a>
    </li>
  );
}

export function Articles() {
  const books = publications.filter((p) => p.kind === "book");
  const years = workYears();
  const [yearFilter, setYearFilter] = useState<string>("all");
  const archive = useMemo(() => {
    const all = getWorksSorted();
    if (yearFilter === "all") return all;
    return all.filter((w) => w.year === yearFilter);
  }, [yearFilter]);

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
            Books and works archive
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Books I am glad to share, plus a growable archive of papers and
            chapters (seeded from recent news and ORCID). Current-year
            spotlight also appears under News. Full lists:{" "}
            <a
              href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              Google Scholar
            </a>{" "}
            ·{" "}
            <a
              href="https://orcid.org/0000-0001-6926-6665"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              ORCID
            </a>
            .
          </p>
        </div>

        {books.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-subtle">
              Books
            </h3>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {books.map((item) => (
                <PubRow key={item.title} item={item} />
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-subtle">
                Works archive
              </h3>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Papers, chapters, and conference items. First/co badges when
                author order is known — never invented.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="text-xs uppercase tracking-wider text-subtle">
                Year
              </span>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-ink"
              >
                <option value="all">All</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ul className="mt-4 rounded-xl border border-border bg-surface px-5 shadow-soft sm:px-6">
            {archive.map((item) => (
              <WorkRow key={`${item.year}-${item.title}`} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
