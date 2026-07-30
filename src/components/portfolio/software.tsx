import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Streamlit / simulation software. Replace placeholder hrefs when the user
 * shares final Streamlit Cloud + GitHub URLs.
 */
const apps = [
  {
    title: "Simulation app 1",
    description:
      "Interactive construction / engineering simulation built with Streamlit. Open the live app or browse the source on GitHub.",
    tags: ["Streamlit", "Simulation", "Python"],
    streamlitUrl: "#software",
    githubUrl: "#software",
    pending: true,
  },
  {
    title: "Simulation app 2",
    description:
      "Second interactive tool for research and teaching — web-based simulation hosted on Streamlit Community Cloud.",
    tags: ["Streamlit", "Simulation", "Python"],
    streamlitUrl: "#software",
    githubUrl: "#software",
    pending: true,
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
            Interactive software I develop for research and teaching — published
            on Streamlit and open on GitHub. Live links will appear here once
            shared.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {apps.map((app, i) => (
            <article
              key={app.title + i}
              className="group flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:p-7"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="font-mono text-xs tabular-nums text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {app.pending ? (
                  <span className="rounded-full border border-border bg-bg-deep px-2.5 py-1 text-xs text-subtle">
                    Links coming soon
                  </span>
                ) : (
                  <a
                    href={app.streamlitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent"
                    aria-label={`Open ${app.title}`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
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
              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  asChild
                  size="sm"
                  variant={app.pending ? "secondary" : "default"}
                  className={app.pending ? "pointer-events-none opacity-70" : ""}
                >
                  <a
                    href={app.streamlitUrl}
                    target={app.pending ? undefined : "_blank"}
                    rel={app.pending ? undefined : "noopener noreferrer"}
                  >
                    Open on Streamlit
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className={app.pending ? "pointer-events-none opacity-70" : ""}
                >
                  <a
                    href={app.githubUrl}
                    target={app.pending ? undefined : "_blank"}
                    rel={app.pending ? undefined : "noopener noreferrer"}
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
