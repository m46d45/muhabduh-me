import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Construction & Infrastructure Management in Indonesia",
    description:
      "A book project still in progress on construction and infrastructure management in the Indonesian context — written for students and practitioners.",
    tags: ["Book project", "Infrastructure", "Indonesia"],
    href: "https://sway.cloud.microsoft/H23UaNMXsSvoJTqL?ref=Link",
  },
  {
    title: "ConCERN 2026",
    description:
      "An international conference on sustainable and responsible construction that I am involved with, alongside many colleagues.",
    tags: ["Conference", "Sustainable construction"],
    href: "https://concern.itb.ac.id",
  },
  {
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
            <article
              key={project.title}
              className="group flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:p-7"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="font-mono text-xs tabular-nums text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors duration-150 group-hover:border-accent/40 group-hover:text-accent"
                  aria-label={`Open ${project.title}`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
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
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mt-5 w-fit px-0 text-accent hover:bg-transparent hover:text-accent-soft"
              >
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open link
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
