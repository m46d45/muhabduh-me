import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const apps = [
  {
    title: "Parade of Trades — Team Work Simulation",
    description:
      "Interactive Streamlit simulation of the Parade of Trades (lean construction, after Iris Tommelein) — exploring workflow, variability, and collaboration in multi-trade production.",
    tags: ["Streamlit", "Lean construction", "Parade of Trades", "Python"],
    streamlitUrl: "https://parade-tim-kerja.streamlit.app/",
    githubUrl: "https://github.com/m46d45/Parade-Tim-Kerja",
  },
  {
    title: "SimKon — Earthwork Operations",
    description:
      "Construction operations simulation focused on earthwork — a web-based tool for teaching and exploring production systems in construction (SimKon v1.0).",
    tags: ["Streamlit", "Earthwork", "Construction ops", "Python"],
    streamlitUrl: "https://simkon-earthwork.streamlit.app/",
    githubUrl: "https://github.com/m46d45/SimKon",
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
            Interactive software for research and teaching — construction
            operations and lean production simulations, hosted on Streamlit and
            open on GitHub.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {apps.map((app, i) => (
            <article
              key={app.title}
              className="group flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:p-7"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="font-mono text-xs tabular-nums text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={app.streamlitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent"
                  aria-label={`Open ${app.title}`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
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
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <a
                    href={app.streamlitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open on Streamlit
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <a
                    href={app.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Source on GitHub
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
