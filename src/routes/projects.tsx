import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Projects } from "@/components/portfolio/projects";

export const Route = createFileRoute("/projects")({
  component: ProjectsRoute,
  head: () => ({
    meta: [
      { title: "Projects — Muhamad Abduh" },
      {
        name: "description",
        content:
          "Books, gatherings, and programmes Muhamad Abduh is part of — SNKR, LC-MPBI, ConCERN, GOBUILD, and more.",
      },
    ],
  }),
});

function ProjectsRoute() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Projects />
      </div>
    </SiteShell>
  );
}
