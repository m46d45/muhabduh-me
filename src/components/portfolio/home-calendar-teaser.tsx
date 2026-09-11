import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "@tanstack/react-router";

const CAL_ID =
  "d379728b75d6aec0cb1e51eb00305b9cac17df9d6bb46fc34480bd01212bd044@group.calendar.google.com";

const EMBED_AGENDA = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CAL_ID)}&ctz=Asia%2FJakarta&hl=en&mode=AGENDA&showTitle=0&showPrint=0&showCalendars=0&showTz=0&wkst=1&bgcolor=%23FFFCF7`;

/** Compact upcoming strip for the home page — full calendar stays on /calendar. */
export function HomeCalendarTeaser() {
  return (
    <section
      id="upcoming"
      className="section-pad border-t border-border bg-bg-deep/30 py-16 sm:py-20"
    >
      <div className="container-narrow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
              Calendar
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Upcoming seminars &amp; conferences
            </h2>
            <p className="mt-3 text-sm text-muted leading-relaxed sm:text-base">
              A quick look at what is coming up — open the full public calendar
              for the month view and ICS subscribe.
            </p>
          </div>
          <Link
            to="/calendar"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            Open calendar
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <CalendarDays className="h-4 w-4 text-accent" aria-hidden />
            <span className="text-sm font-medium text-ink">Next up</span>
            <span className="ml-auto text-xs text-subtle">Asia/Jakarta</span>
          </div>
          <iframe
            title="Upcoming seminars and conferences"
            src={EMBED_AGENDA}
            className="h-[18rem] w-full border-0 bg-surface sm:h-[20rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
