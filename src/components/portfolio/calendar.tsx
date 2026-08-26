import { useEffect, useState } from "react";
import { CalendarDays, Download, ExternalLink, Eye } from "lucide-react";
import { recordLinkClick } from "@/components/portfolio/link-stats";
import { fetchCount, formatCount } from "@/lib/counter";

const CAL_ID =
  "d379728b75d6aec0cb1e51eb00305b9cac17df9d6bb46fc34480bd01212bd044@group.calendar.google.com";

const EMBED_BASE = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CAL_ID)}&ctz=Asia%2FJakarta&hl=en&showTitle=0&showPrint=0&showCalendars=0&showTz=1&wkst=1&bgcolor=%23FFFCF7`;

const EMBED_MONTH = `${EMBED_BASE}&mode=MONTH`;
const EMBED_AGENDA = `${EMBED_BASE}&mode=AGENDA`;

const ICS_HREF = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CAL_ID)}/public/basic.ics`;
const ICS_TRACK_ID = "calendar-ics-download";

function IcsDownload() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchCount(`click-${ICS_TRACK_ID}`, "get").then((n) => {
      if (!cancelled) setCount(n ?? 0);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onClick() {
    const n = await recordLinkClick(ICS_TRACK_ID);
    if (n !== null) setCount(n);
    else setCount((c) => (c === null ? 1 : c + 1));
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a
        href={ICS_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-ink shadow-soft transition-colors hover:border-accent/40 hover:text-accent"
      >
        <Download className="h-3.5 w-3.5" />
        Download ICS
      </a>
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-deep/80 px-2.5 py-1 text-xs text-muted"
        title="ICS downloads"
      >
        <Eye className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
        <span className="font-mono tabular-nums font-medium text-ink">
          {count === null ? "…" : formatCount(count)}
        </span>
        <span className="text-subtle">downloads</span>
      </span>
      <p className="w-full max-w-lg text-xs leading-relaxed text-subtle sm:w-auto">
        Add it to Google, Outlook, or Apple Calendar so new events arrive on
        their own.
      </p>
    </div>
  );
}

export function Calendar() {
  return (
    <section
      id="calendar"
      className="section-pad border-t border-border bg-bg-deep/40 py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Calendar
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Seminars & conferences
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            A public calendar of seminars and conferences I monitor, shared
            here for anyone who is interested. No login. Asia/Jakarta time.
            Event titles use NAS · (national) and INT · (international).
          </p>
        </div>

        <IcsDownload />

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <CalendarDays className="h-4 w-4 text-accent" aria-hidden />
            <span className="text-sm font-medium text-ink">Public view</span>
            <span className="ml-auto hidden text-xs text-subtle sm:inline">
              Asia/Jakarta
            </span>
            <a
              href={EMBED_MONTH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
            >
              Open full calendar
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <iframe
            title="Seminars and conferences — month view"
            src={EMBED_MONTH}
            className="hidden h-[38rem] w-full border-0 bg-surface md:block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <iframe
            title="Seminars and conferences — agenda view"
            src={EMBED_AGENDA}
            className="block h-[34rem] w-full border-0 bg-surface md:hidden"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
