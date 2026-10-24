import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { BlogPost } from "@/components/blog/blog-post";
import { fetchPost } from "@/lib/content/api";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await fetchPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    return pageHead({
      title: `${loaderData.title} — Memulai dengan Bertanya`,
      description: loaderData.description,
      path: `/blog/${loaderData.slug}`,
      image: loaderData.ogImage,
      type: "article",
      locale: "id_ID",
    });
  },
  component: BlogPostRoute,
});

function BlogPostRoute() {
  const post = Route.useLoaderData();
  return (
    <SiteShell>
      <BlogPost post={post} />
    </SiteShell>
  );
}
