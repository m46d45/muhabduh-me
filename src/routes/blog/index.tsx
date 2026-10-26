import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { BlogLanding } from "@/components/blog/blog-landing";
import { fetchBlogIndex } from "@/lib/content/api";
import { pageHead } from "@/lib/seo";

const description = "Memulai dengan Bertanya";

export const Route = createFileRoute("/blog/")({
  loader: () => fetchBlogIndex(),
  head: ({ loaderData }) => {
    const head = pageHead({
      title: "Blog — Memulai dengan Bertanya",
      description,
      path: "/blog",
      locale: "id_ID",
    });
    const previewOnly = loaderData?.posts?.some((post) => post.draft) ?? false;
    return {
      ...head,
      meta: previewOnly
        ? [...head.meta, { name: "robots", content: "noindex, nofollow" }]
        : head.meta,
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
