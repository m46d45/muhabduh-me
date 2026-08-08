import { ExternalLink } from "lucide-react";
import { TrackedLink } from "@/components/portfolio/link-stats";

type SoftApp = {
  id: string;
  title: string;
  description: string;
  note: string;
  appUrl: string;
  trackId: string;
};

/** Live teaching tools on Vercel — short blurbs only. */
const apps: SoftApp[] = [
  {
    id: "neo-cyclone",
    title: "Neo-CYCLONE",
    description:
      "AI-assisted CYCLONE modeling and simulation for construction operations (Halpin).",
    note: "Vercel",
    appUrl: "https://neo-cyclone.vercel.app/",
    trackId: "software-neo-cyclone-vercel",
  },
  {
    id: "mp2k",
    title: "MP2K",
    description:
      "Multi-mode project production (onsite · near-site · far supply) for PPM teaching.",
    note: "Vercel",
    appUrl: "https://mp2k.vercel.app/",
    trackId: "software-mp2k-vercel",
  },
  {
    id: "siklops",
    title: "SiklOps",
    description:
      "Discrete-event simulation of cyclic construction operations, simple → complex.",
    note: "Vercel",
    appUrl: "https://siklops.vercel.app/",
    trackId: "software-siklops-vercel",
  },
  {
    id: "rusun-takt",
    title: "Rusun Takt",
    description:
      "Lean takt simulation for a three-storey rusun: push vs JIT, zones, and waiting waste.",
    note: "Vercel",
    appUrl: "https://rusun-takt.vercel.app/",
    trackId: "software-rusun-takt-vercel",
  },
  {
    id: "parade-tim-kerja",
    title: "Parade Tim Kerja",
    description:
      "Parade-of-trades zone-flow for learning variability, WIP, and batch handoff.",
    note: "Vercel",
    appUrl: "https://parade-tim-kerja.vercel.app/",
    trackId: "software-parade-tim-kerja-vercel",
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
            Browser-based tools for teaching construction production and lean
            practice.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {apps.map((app, i) => (
            <article
              key={app.id}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:p-6"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="font-mono text-xs tabular-nums text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-accent/25 bg-teal-wash px-2.5 py-0.5 text-xs font-medium text-accent">
                  {app.note}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                {app.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {app.description}
              </p>
              <div className="mt-5">
                <TrackedLink href={app.appUrl} trackId={app.trackId}>
                  <span className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90">
                    Open
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
