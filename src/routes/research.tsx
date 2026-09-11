import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Research } from "@/components/portfolio/research";
import { Projects } from "@/components/portfolio/projects";
import { Networks } from "@/components/portfolio/networks";

export const Route = createFileRoute("/research")({
  component: ResearchRoute,
  head: () => ({
    meta: [
      { title: "Research — Muhamad Abduh" },
      {
        name: "description",
        content:
          "Current studies, ongoing projects, and professional networks — Muhamad Abduh.",
      },
    ],
  }),
});

function ResearchRoute() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Research />
        <Projects />
        <Networks />
      </div>
    </SiteShell>
  );
}
