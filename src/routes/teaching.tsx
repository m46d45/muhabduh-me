import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Teaching } from "@/components/portfolio/teaching";

export const Route = createFileRoute("/teaching")({
  component: TeachingRoute,
  head: () => ({
    meta: [{ title: "Teaching — Muhamad Abduh" }],
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
