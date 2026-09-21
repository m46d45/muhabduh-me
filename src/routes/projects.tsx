import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Projects } from "@/components/portfolio/projects";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/projects")({
  component: ProjectsRoute,
  head: () =>
    pageHead({
      title: "Projects — Muhamad Abduh",
      description:
        "Books, gatherings, and programmes Muhamad Abduh is part of — SNKR, LC-MPBI, ConCERN, GOBUILD, and more.",
      path: "/projects",
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
