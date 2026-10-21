import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Software } from "@/components/portfolio/software";
import { fetchToolPosts } from "@/lib/content/api";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools")({
  loader: () => fetchToolPosts(),
  component: ToolsRoute,
  head: () =>
    pageHead({
      title: "Tools — Muhamad Abduh",
      description:
        "Teaching simulation tools — Pinjem100, SiapKerja!, SiklOps, Neo-CYCLONE, and more.",
      path: "/tools",
    }),
});

function ToolsRoute() {
  const { postsByTool } = Route.useLoaderData();
  return (
    <SiteShell>
      <div className="pt-10">
        <Software postsByTool={postsByTool} />
      </div>
    </SiteShell>
  );
}
