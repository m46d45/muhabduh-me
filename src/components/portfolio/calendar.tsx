import { CalendarDays, Download, ExternalLink } from "lucide-react";
import { TrackedLink } from "@/components/portfolio/link-stats";

const CAL_ID =
  "d379728b75d6aec0cb1e51eb00305b9cac17df9d6bb46fc34480bd01212bd044@group.calendar.google.com";

const EMBED_BASE = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CAL_ID)}&ctz=Asia%2FJakarta&hl=id&showTitle=0&showPrint=0&showCalendars=0&showTz=1&wkst=1&bgcolor=%23FFFCF7`;

const EMBED_MONTH = `${EMBED_BASE}&mode=MONTH`;
const EMBED_AGENDA = `${EMBED_BASE}&mode=AGENDA`;

const ICS_HREF = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CAL_ID)}/public/basic.ics`;

export function Calendar() {
  return (
    <section
      id="calendar"
      className="section-pad border-t border-border py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="flex max-w-2xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
              Calendar
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Seminar & Konferensi TS
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Kalender publik seminar dan konferensi. Zona waktu Asia/Jakarta.
              Tanpa login. Acara memakai awalan NAS · (nasional) dan INT ·
              (internasional). Isi mengikuti kalender Google yang sama.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <TrackedLink
            href={ICS_HREF}
            trackId="calendar-ics-download"
            showStats={false}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-ink shadow-soft transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Download className="h-3.5 w-3.5" />
            Unduh ICS
          </TrackedLink>
          <p className="max-w-md text-xs leading-relaxed text-subtle">
            Pasang di Google, Outlook, atau Apple Calendar agar jadwal baru
            ikut masuk otomatis.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <CalendarDays className="h-4 w-4 text-accent" aria-hidden />
            <span className="text-sm font-medium text-ink">
              Tampilan publik
            </span>
            <span className="ml-auto hidden text-xs text-subtle sm:inline">
              Asia/Jakarta
            </span>
            <a
              href={EMBED_MONTH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
            >
              Buka penuh
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <iframe
            title="Seminar & Konferensi TS — tampilan bulan"
            src={EMBED_MONTH}
            className="hidden h-[38rem] w-full border-0 bg-surface md:block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <iframe
            title="Seminar & Konferensi TS — tampilan agenda"
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
