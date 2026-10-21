import { ExternalLink } from "lucide-react";
import { TrackedLink } from "@/components/portfolio/link-stats";
import { tools } from "@/data/tools.mjs";
import { DiscussedOnBlog } from "@/components/blog/blog-links";

/** Live teaching tools on Vercel — short blurbs only. Newest first. */
const apps = tools;

export function Software({
  postsByTool = {},
}: {
  postsByTool?: Record<string, { slug: string; title: string }[]>;
}) {
  return (
    <section
      id="tools"
      className="section-pad border-t border-border bg-bg-deep/40 py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Tools
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Simulation tools
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Browser-based tools for teaching construction production, markets,
            and lean practice.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {apps.map((app, i) => (
            <article
              key={app.id}
              id={app.id}
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
              <DiscussedOnBlog posts={postsByTool[app.id] ?? []} />
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
