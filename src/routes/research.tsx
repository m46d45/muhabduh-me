import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Research } from "@/components/portfolio/research";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/research")({
  component: ResearchRoute,
  head: () =>
    pageHead({
      title: "Research — Muhamad Abduh",
      description:
        "Current studies and research themes in lean and sustainable construction — Muhamad Abduh, ITB.",
      path: "/research",
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
