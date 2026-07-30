import { ArrowUpRight, Newspaper } from "lucide-react";
import { getLatestNews, type NewsItem } from "@/data/news";

const kindLabel: Record<NewsItem["kind"], string> = {
  paper: "Paper",
  article: "Article",
  book: "Book",
};

function formatWhen(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export function News() {
  const items = getLatestNews(3);
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
              Recent publications
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              The three most recent papers, articles, or books — often newly
              indexed on Google Scholar. Older items step aside when something
              newer is added.
            </p>
          </div>
          <a
            href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en&view_op=list_works&sortby=pubdate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            All on Google Scholar
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <ul className="mt-10 space-y-3">
          {items.map((item, index) => (
            <li key={item.title + item.date}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
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
                </div>
                <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-subtle transition-colors group-hover:text-accent sm:mt-1 sm:block" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
