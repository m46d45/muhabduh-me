import { ExternalLink } from "lucide-react";
import { TrackedLink } from "@/components/portfolio/link-stats";

const apps = [
  {
    id: "rusun-takt",
    title: "Rusun Takt — 3-storey housing simulation",
    description:
      "A lean construction teaching simulation for a walk-up rusun (3 floors, 5 zones). Students compare push vs JIT starts, parade-of-trades flow across seven crews, takt planning, curing delays, and how waiting turns into waste — inspired by Takt Towers.",
    tags: [
      "Streamlit",
      "Lean construction",
      "Takt planning",
      "Rusun",
      "Teaching",
    ],
    note: "New · Aug 2026",
    streamlitUrl: "https://rusun-takt-simulasi.streamlit.app/",
  },
  {
    id: "parade-tim-kerja",
    title: "Parade Tim Kerja — Zone-flow simulation",
    description:
      "Interactive lean construction classroom tool (after Iris Tommelein’s Parade of Trades), set in an Indonesian concrete floor cycle. Students explore variability, WIP, throughput, and cycle time — with scenario comparison, CONWIP / Little’s Law views, and a built-in learning manual.",
    tags: [
      "Streamlit",
      "Lean construction",
      "Parade of Trades",
      "Teaching",
      "Python",
    ],
    note: "Updated Aug 2026",
    streamlitUrl: "https://parade-tim-kerja.streamlit.app/",
  },
  {
    id: "simkon",
    title: "SimKon — Earthwork operations (v1.0)",
    description:
      "Discrete-event simulation of earthmoving production (excavator + dump truck): load → haul → dump → return. Parameters for fleet and cycle times, throughput and utilisation metrics, and simple queueing views — for teaching construction operations.",
    tags: [
      "Streamlit",
      "Earthwork",
      "DES",
      "Construction ops",
      "Python",
    ],
    note: "v1.0",
    streamlitUrl: "https://simkon-earthwork.streamlit.app/",
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
            Interactive tools I build for teaching and learning — free to try on
            Streamlit. They are still evolving; feedback from class use is
            welcome.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, i) => (
            <article
              key={app.id}
              className="group flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:p-7"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="font-mono text-xs tabular-nums text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {app.note && (
                  <span className="rounded-full border border-accent/25 bg-teal-wash px-2.5 py-1 text-xs font-medium text-accent">
                    {app.note}
                  </span>
                )}
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                {app.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {app.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
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
                <TrackedLink
                  href={app.streamlitUrl}
                  trackId={`software-${app.id}-streamlit`}
                >
                  <span className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90">
                    Open on Streamlit
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
