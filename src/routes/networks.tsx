import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Networks } from "@/components/portfolio/networks";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/networks")({
  component: NetworksRoute,
  head: () =>
    pageHead({
      title: "Networks — Muhamad Abduh",
      description:
        "Societies, forums, and collaboration networks Muhamad Abduh learns with.",
      path: "/networks",
    }),
});

function NetworksRoute() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Networks />
      </div>
    </SiteShell>
  );
}
