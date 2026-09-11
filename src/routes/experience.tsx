import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Experience } from "@/components/portfolio/experience";

export const Route = createFileRoute("/experience")({
  component: ExperienceRoute,
  head: () => ({
    meta: [
      { title: "Experience — Muhamad Abduh" },
      {
        name: "description",
        content:
          "Roles, affiliations, and selected reviewing — Muhamad Abduh.",
      },
    ],
  }),
});

function ExperienceRoute() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Experience />
      </div>
    </SiteShell>
  );
}
