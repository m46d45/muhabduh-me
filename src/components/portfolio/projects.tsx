import { useEffect, useState } from "react";
import { ArrowUpRight, Eye } from "lucide-react";
import { fetchCount, formatCount } from "@/lib/counter";
import { recordLinkClick } from "@/components/portfolio/link-stats";

const projects = [
  {
    id: "book-infra-id",
    title: "Construction & Infrastructure Management in Indonesia",
    description:
      "A book project still in progress on construction and infrastructure management in the Indonesian context — written for students and practitioners.",
    tags: ["Book project", "Infrastructure", "Indonesia"],
    href: "https://sway.cloud.microsoft/H23UaNMXsSvoJTqL?ref=Link",
  },
  {
    id: "concern-2026",
    title: "ConCERN 2026",
    description:
      "An international conference on sustainable and responsible construction that I am involved with, alongside many colleagues.",
    tags: ["Conference", "Sustainable construction"],
    href: "https://concern.itb.ac.id",
  },
  {
    id: "gobuild-2026",
    title: "GOBUILD 2026",
    description:
      "The 1st International Online Conference on Sustainable Construction — a shared platform for researchers and practitioners.",
    tags: ["Conference", "Online", "Sustainability"],
    href: "https://sciforum.net/event/GOBUILD2026",
  },
];

export function Projects() {
  return (
    <section
      id="projects"
      className="section-pad border-t border-border py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Projects
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Work in progress
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            A few books, conferences, and programs I am part of — alongside
            everyday research and teaching.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const trackId = `project-${project.id}`;
  const [clicks, setClicks] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchCount(`click-${trackId}`, "get").then((n) => {
      if (!cancelled && n !== null) setClicks(n);
    });
    return () => {
      cancelled = true;
    };
  }, [trackId]);

  return (
    <article className="group flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-3">
        <span className="font-mono text-xs tabular-nums text-subtle">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
        {project.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-bg-deep px-2.5 py-1 text-xs text-subtle"
          >
            {tag}
          </span>
        ))}
      </div>
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={async () => {
          const n = await recordLinkClick(trackId);
          if (n !== null) setClicks(n);
        }}
        className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:underline underline-offset-2"
      >
        Open link
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
      <span className="mt-2 inline-flex items-center gap-1 text-xs text-subtle">
        <Eye className="h-3 w-3 text-accent/80" aria-hidden />
        {clicks === null ? (
          <span className="font-mono tabular-nums">…</span>
        ) : (
          <>
            <span className="font-mono tabular-nums text-muted">
              {formatCount(clicks)}
            </span>
            <span>clicks</span>
          </>
        )}
      </span>
    </article>
  );
}
