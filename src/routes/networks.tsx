import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Networks } from "@/components/portfolio/networks";

export const Route = createFileRoute("/networks")({
  component: NetworksRoute,
  head: () => ({
    meta: [
      { title: "Networks — Muhamad Abduh" },
      {
        name: "description",
        content:
          "Societies, forums, and collaboration networks Muhamad Abduh learns with.",
      },
    ],
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
