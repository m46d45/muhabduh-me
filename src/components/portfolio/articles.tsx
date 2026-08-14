import { useEffect, useState } from "react";
import { ArrowUpRight, BookMarked, Eye, FileText } from "lucide-react";
import { publications, type PublicationItem } from "@/data/publications";
import { fetchCount, formatCount } from "@/lib/counter";
import { recordLinkClick } from "@/components/portfolio/link-stats";

const kindLabel: Record<PublicationItem["kind"], string> = {
  book: "Book",
  article: "Article",
};

const kindIcon = {
  book: BookMarked,
  article: FileText,
} as const;

function pubTrackId(item: PublicationItem): string {
  return `pub-${item.kind}-${item.title
    .slice(0, 28)
    .replace(/\W+/g, "-")
    .toLowerCase()}`;
}

function Cover({ item }: { item: PublicationItem }) {
  const Icon = kindIcon[item.kind];
  if (item.cover) {
    return (
      <img
        src={item.cover}
        alt=""
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
  const trackId = pubTrackId(item);
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
    <li>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={async () => {
          const n = await recordLinkClick(trackId);
          if (n !== null) setClicks(n);
          else setClicks((c) => (c ?? 0) + 1);
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
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-deep/80 px-2.5 py-1 text-xs text-muted">
              <Eye className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
              <span className="font-mono tabular-nums font-medium text-ink">
                {clicks === null ? "…" : formatCount(clicks)}
              </span>
              <span className="text-subtle">clicks</span>
            </span>
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

export function Articles() {
  const books = publications.filter((p) => p.kind === "book");
  const articlesList = publications.filter((p) => p.kind === "article");

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
            Books and selected writing
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Books and longer pieces I am glad to share. Recent journal papers
            appear under{" "}
            <a
              href="#news"
              className="text-accent underline-offset-2 hover:underline"
            >
              News
            </a>
            ; a fuller paper list is on{" "}
            <a
              href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              Google Scholar
            </a>{" "}
            and under Research.
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

        {articlesList.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-subtle">
              Selected articles
            </h3>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {articlesList.map((item) => (
                <PubRow key={item.title} item={item} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
