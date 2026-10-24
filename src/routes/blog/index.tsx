import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { BlogLanding } from "@/components/blog/blog-landing";
import { fetchBlogIndex } from "@/lib/content/api";
import { pageHead } from "@/lib/seo";

const description =
  "Setiap tulisan dalam seri ini berangkat dari satu pertanyaan yang saya temui di proyek konstruksi, di ruang kuliah, atau saat membaca data lapangan. Jawabannya saya susun dari penelitian yang sudah saya kerjakan, dengan bahasa yang mudah diikuti praktisi, mahasiswa, dan pembaca umum.";

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
