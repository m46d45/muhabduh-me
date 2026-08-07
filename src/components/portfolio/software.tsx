import { ExternalLink } from "lucide-react";
import { TrackedLink } from "@/components/portfolio/link-stats";

type SoftApp = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  tags: string[];
  note: string;
  appUrl: string;
  buttonLabel: string;
  trackId: string;
};

/**
 * Teaching simulations — copy aligned with live Vercel apps (Aug 2026).
 * Newest / primary product first where useful; all three always listed.
 */
const apps: SoftApp[] = [
  {
    id: "rusun-takt",
    title: "Rusun Takt",
    subtitle: "3-storey walk-up housing · lean takt simulation",
    description:
      "An educational lean construction simulation for a three-floor walk-up rusun (inspired by Takt Towers, adapted to an Indonesian context). Seven sequential crews move through five zones per floor while you compare push starts against just-in-time, capacity variation, curing delays, waiting waste, and owner contract outcomes.",
    points: [
      "7 wagons: structure → slab & stairs → walls → MEP → plaster → tiles → paint",
      "Push vs JIT starts, one zone–one team, 7-day slab curing per zone",
      "Takt plan by week, owner duration, penalty and margin views",
    ],
    tags: [
      "Vercel",
      "Lean construction",
      "Takt plan",
      "Parade of trades",
      "Rusun",
    ],
    note: "Full app · Vercel",
    appUrl: "https://rusun-takt.vercel.app/",
    buttonLabel: "Open Rusun Takt",
    trackId: "software-rusun-takt-vercel",
  },
  {
    id: "parade-tim-kerja",
    title: "Parade Tim Kerja",
    subtitle: "Zone-flow parade · variability & batch handoff",
    description:
      "A classroom parade-of-trades simulation for construction production learning (after Tommelein and colleagues). Watch how variability, sequential handoffs, and zoning affect duration, WIP, utilisation, and idle cost — free in the browser, with no software install.",
    points: [
      "Zone-flow with sequential trades (formwork → finishing context)",
      "Capacity, variability, and batch handoff; LOB / WIP / multi-scenario compare",
      "Takt plan aids (bay vs planning zone) and export for class exercises",
    ],
    tags: [
      "Vercel",
      "Streamlit",
      "Lean construction",
      "Zone-flow",
      "Teaching",
    ],
    note: "Landing · Vercel",
    // Vercel landing; simulation opens from there (Streamlit Cloud)
    appUrl: "https://parade-tim-kerja.vercel.app/",
    buttonLabel: "Open Parade Tim Kerja",
    trackId: "software-parade-tim-kerja-vercel",
  },
  {
    id: "siklops",
    title: "SiklOps",
    subtitle: "Cyclic construction operations · DES",
    description:
      "SiklOps (Siklus Operasi) is a discrete-event simulation for repeating construction operations — not whole-project scheduling. Run earthmoving, bricklaying, and ready-mixed concrete placing (buggy / crane bucket / pump), then read shared result tabs on throughput, queues, match factor, cost, and CO₂e.",
    points: [
      "Operations: earthmoving · bricklaying · concreting (RMC dual-cycle)",
      "Fleet, cycle times, distributions, cost (Rp/hour), fuel → emissions",
      "Standard result tabs, scenarios, CSV export, and an in-app manual",
    ],
    tags: [
      "Vercel",
      "DES",
      "Earthmoving",
      "Bricklaying",
      "Concreting",
      "Teaching",
    ],
    note: "Full app · Vercel",
    appUrl: "https://siklops.vercel.app/",
    buttonLabel: "Open SiklOps",
    trackId: "software-siklops-vercel",
  },
];

export function Software() {
  return (
    <section
      id="software"
      className="section-pad border-t border-border bg-bg-deep/40 py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Software
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Simulation tools
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Three browser-based tools for teaching lean construction and
            production operations. Open them free on Vercel (and Streamlit where
            noted). They keep evolving with classroom use.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {apps.map((app, i) => (
            <article
              key={app.id}
              className="group flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:p-7"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="font-mono text-xs tabular-nums text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-accent/25 bg-teal-wash px-2.5 py-1 text-xs font-medium text-accent">
                  {app.note}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                {app.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">
                {app.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {app.description}
              </p>
              <ul className="mt-4 flex-1 space-y-2 border-t border-border pt-4">
                {app.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-snug text-muted"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70"
                      aria-hidden
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-bg-deep px-2.5 py-1 text-xs text-subtle"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <TrackedLink href={app.appUrl} trackId={app.trackId}>
                  <span className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90">
                    {app.buttonLabel}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
