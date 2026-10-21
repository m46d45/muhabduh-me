import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { BlogLanding } from "@/components/blog/blog-landing";
import { fetchBlogIndex } from "@/lib/content/api";
import { pageHead } from "@/lib/seo";

const description =
  "Seri Memulai dengan Bertanya: setiap tulisan dimulai dari satu pertanyaan yang berangkat dari situasi penelitian Muhamad Abduh.";

export const Route = createFileRoute("/blog/")({
  loader: () => fetchBlogIndex(),
  head: () => {
    const head = pageHead({
      title: "Blog — Memulai dengan Bertanya",
      description,
      path: "/blog",
      locale: "id_ID",
    });
    return {
      ...head,
      links: [
        ...(head.links ?? []),
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "Memulai dengan Bertanya",
          href: "https://muhabduh.id/rss.xml",
        },
      ],
    };
  },
  component: BlogIndexRoute,
});

function BlogIndexRoute() {
  const data = Route.useLoaderData();
  return (
    <SiteShell>
      <BlogLanding topics={data.topics} posts={data.posts} />
    </SiteShell>
  );
}
