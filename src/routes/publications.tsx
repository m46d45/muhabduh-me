import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Articles } from "@/components/portfolio/articles";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/publications")({
  component: PublicationsRoute,
  head: () =>
    pageHead({
      title: "Publications — Muhamad Abduh",
      description:
        "Books and works archive — lean construction, sustainability, and construction management.",
      path: "/publications",
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
