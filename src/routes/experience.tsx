import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Experience } from "@/components/portfolio/experience";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/experience")({
  component: ExperienceRoute,
  head: () =>
    pageHead({
      title: "Experience — Muhamad Abduh",
      description:
        "Roles, affiliations, and selected reviewing — Muhamad Abduh.",
      path: "/experience",
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
