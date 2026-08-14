import { useEffect, useState } from "react";
import { ArrowUpRight, Eye, Newspaper } from "lucide-react";
import {
  currentNewsYear,
  getLatestNews,
  type NewsItem,
} from "@/data/news";
import { fetchCount, formatCount } from "@/lib/counter";
import { recordLinkClick } from "@/components/portfolio/link-stats";

const kindLabel: Record<NewsItem["kind"], string> = {
  paper: "Paper",
  article: "Article",
  book: "Book",
  chapter: "Chapter",
};

function formatWhen(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

function newsTrackId(item: NewsItem): string {
  return `news-${item.date}-${item.title
    .slice(0, 24)
    .replace(/\W+/g, "-")
    .toLowerCase()}`;
}

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

function NewsRow({ item, index }: { item: NewsItem; index: number }) {
  const trackId = newsTrackId(item);
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
        }}
        className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 shadow-soft transition-colors duration-150 hover:border-accent/30 sm:flex-row sm:items-start sm:gap-5 sm:p-6"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-teal-wash text-accent">
          <Newspaper className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
            <span className="rounded-full border border-accent/25 bg-teal-wash px-2 py-0.5 font-medium text-accent">
              {kindLabel[item.kind]}
            </span>
            <span className="font-mono tabular-nums">
              {formatWhen(item.date)}
            </span>
            <span aria-hidden>·</span>
            <span className="truncate">{item.venue}</span>
            {index === 0 && (
              <>
                <span aria-hidden>·</span>
                <span className="font-medium text-accent">Latest</span>
              </>
            )}
          </div>
          <h3 className="mt-2 font-display text-base font-semibold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-lg">
            {item.title}
          </h3>
          {item.authors && (
            <p className="mt-1.5 text-sm text-muted">{item.authors}</p>
          )}
          <div className="mt-3">
            <ClickLine count={clicks} />
          </div>
        </div>
        <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-subtle transition-colors group-hover:text-accent sm:mt-1 sm:block" />
      </a>
    </li>
  );
}

function TrackedScholarLink() {
  const trackId = "news-all-scholar";
  const [clicks, setClicks] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchCount(`click-${trackId}`, "get").then((n) => {
      if (!cancelled) setClicks(n ?? 0);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <span className="inline-flex flex-col items-start gap-1 sm:items-end">
      <a
        href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en&view_op=list_works&sortby=pubdate"
        target="_blank"
        rel="noopener noreferrer"
        onClick={async () => {
          const n = await recordLinkClick(trackId);
          if (n !== null) setClicks(n);
        }}
        className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent underline-offset-2 hover:underline"
      >
        All on Google Scholar
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
      <ClickLine count={clicks} />
    </span>
  );
}

export function News() {
  const year = currentNewsYear();
  const items = getLatestNews();
  if (items.length === 0) return null;

  return (
    <section
      id="news"
      className="section-pad border-t border-border py-20 sm:py-24"
    >
      <div className="container-narrow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
              News
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Publications in {year}
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Papers, articles, and books from this year as they appear on
              Google Scholar. Last year’s items step aside when the calendar
              turns.
            </p>
          </div>
          <TrackedScholarLink />
        </div>

        <ul className="mt-10 space-y-3">
          {items.map((item, index) => (
            <NewsRow key={item.title + item.date} item={item} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
