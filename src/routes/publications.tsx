import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Articles } from "@/components/portfolio/articles";

export const Route = createFileRoute("/publications")({
  component: PublicationsRoute,
  head: () => ({
    meta: [{ title: "Publications — Muhamad Abduh" }],
  }),
});

function PublicationsRoute() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Articles />
      </div>
    </SiteShell>
  );
}
