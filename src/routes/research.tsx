import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Research } from "@/components/portfolio/research";

export const Route = createFileRoute("/research")({
  component: ResearchRoute,
  head: () => ({
    meta: [
      { title: "Research — Muhamad Abduh" },
      {
        name: "description",
        content: "Current studies and research themes — Muhamad Abduh.",
      },
    ],
  }),
});

function ResearchRoute() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Research />
      </div>
    </SiteShell>
  );
}
