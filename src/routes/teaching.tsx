import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Teaching } from "@/components/portfolio/teaching";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/teaching")({
  component: TeachingRoute,
  head: () =>
    pageHead({
      title: "Teaching — Muhamad Abduh",
      description:
        "ITB courses, ICE programmes, and lean construction teaching — Muhamad Abduh.",
      path: "/teaching",
    }),
});

function TeachingRoute() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Teaching />
      </div>
    </SiteShell>
  );
}
