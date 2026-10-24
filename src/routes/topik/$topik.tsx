import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { TopicPage } from "@/components/blog/topic-page";
import { fetchTopic } from "@/lib/content/api";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/topik/$topik")({
  loader: async ({ params }) => {
    const topic = await fetchTopic({ data: { slug: params.topik } });
    if (!topic) throw notFound();
    return topic;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    return pageHead({
      title: `${loaderData.name} — Memulai dengan Bertanya`,
      description: loaderData.blurb,
      path: `/topik/${loaderData.slug}`,
      locale: "id_ID",
    });
  },
  component: TopicRoute,
});

function TopicRoute() {
  const topic = Route.useLoaderData();
  return (
    <SiteShell>
      <TopicPage
        name={topic.name}
        blurb={topic.blurb}
        posts={topic.posts}
        papers={topic.papers}
        tools={topic.tools}
      />
    </SiteShell>
  );
}
