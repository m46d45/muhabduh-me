import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const cards = [
  {
    to: "/cv" as const,
    label: "CV",
    title: "Curriculum vitae",
    blurb: "Formal biodata, roles, and awards — English, on-site.",
  },
  {
    to: "/publications" as const,
    label: "Publications",
    title: "Books & works archive",
    blurb: "Works archive and books with year filter.",
  },
  {
    to: "/teaching" as const,
    label: "Teaching",
    title: "Courses & ICE",
    blurb: "Core ITB courses and ICE programmes.",
  },
  {
    to: "/research" as const,
    label: "Research",
    title: "Themes & projects",
    blurb: "Current studies, projects, and networks.",
  },
  {
    to: "/tools" as const,
    label: "Tools",
    title: "Simulation software",
    blurb: "SiapKerja!, SiklOps, Neo-CYCLONE.",
  },
  {
    to: "/calendar" as const,
    label: "Calendar",
    title: "Seminars & conferences",
    blurb: "Public calendar — easy to find and subscribe.",
    highlight: true,
  },
];

export function HomeHighlights() {
  return (
    <section
      id="explore"
      className="section-pad border-t border-border py-20 sm:py-24"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Explore
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Sections of this site
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Menu doors live here on the home page — open a section for the full
            story.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={cn(
                "group flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors hover:border-accent/35",
                card.highlight && "ring-2 ring-accent/45 ring-offset-2 ring-offset-bg",
              )}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                {card.label}
              </span>
              <span className="mt-2 font-display text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
                {card.title}
              </span>
              <span className="mt-2 flex-1 text-sm text-muted">{card.blurb}</span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                Open
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
