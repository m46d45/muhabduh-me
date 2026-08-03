import { ExternalLink, Youtube } from "lucide-react";
import { TrackedLink } from "@/components/portfolio/link-stats";
import { networks, type NetworkItem } from "@/data/networks";

const kindLabel: Record<NetworkItem["kind"], string> = {
  society: "Society",
  forum: "Forum",
  campus: "Campus",
  media: "Media",
  accreditation: "Accreditation",
  collaboration: "Collaboration",
  platform: "Platform",
  other: "Network",
};

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function Networks() {
  if (networks.length === 0) return null;

  return (
    <section
      id="networks"
      className="section-pad border-t border-border py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Networks
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Communities I learn with
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Forums, societies, and channels where construction practice and
            ideas are shared — including spaces I help look after or simply join.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {networks.map((item) => {
            const id = slug(item.name);
            return (
              <article
                key={item.name}
                className="flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft sm:p-7"
              >
                <span className="inline-flex w-fit rounded-full border border-border bg-bg-deep px-2.5 py-1 text-xs font-medium text-subtle">
                  {kindLabel[item.kind]}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
                  {item.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
                <div className="mt-6 flex flex-wrap items-end gap-4">
                  {item.website && (
                    <TrackedLink
                      href={item.website}
                      trackId={`network-${id}-web`}
                    >
                      <span className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-raised px-3 py-2 text-sm font-medium text-fg transition-colors hover:border-accent/40">
                        Website
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </TrackedLink>
                  )}
                  {item.youtube && (
                    <TrackedLink
                      href={item.youtube}
                      trackId={`network-${id}-yt`}
                    >
                      <span className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90">
                        <Youtube className="h-3.5 w-3.5" />
                        YouTube
                      </span>
                    </TrackedLink>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
