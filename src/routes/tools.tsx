import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Software } from "@/components/portfolio/software";

export const Route = createFileRoute("/tools")({
  component: ToolsRoute,
  head: () => ({
    meta: [{ title: "Tools — Muhamad Abduh" }],
  }),
});

function ToolsRoute() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Software />
      </div>
    </SiteShell>
  );
}
