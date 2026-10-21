import { Link } from "@tanstack/react-router";
import type { PostCard } from "@/lib/content/types";

type Paper = {
  id: string;
  title: string;
  year: string;
  venue: string;
  href: string;
  doi: string | null;
  posts: { slug: string; title: string }[];
};

type Tool = {
  id: string;
  title: string;
  href: string;
  appUrl: string | null;
};

export function TopicPage({
  name,
  blurb,
  posts,
  papers,
  tools,
}: {
  name: string;
  blurb: string;
  posts: PostCard[];
  papers: Paper[];
  tools: Tool[];
}) {
  return (
    <article className="section-pad pb-20 pt-28">
      <div className="container-narrow">
        <p className="text-sm text-subtle">
          <Link to="/blog" className="text-accent hover:underline">
            Blog
          </Link>
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          {name}
        </h1>
        <p className="mt-4 max-w-2xl text-muted leading-relaxed">{blurb}</p>

        <h2 className="mt-12 font-display text-xl font-semibold text-ink">Tulisan</h2>
        {posts.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Belum ada tulisan pada topik ini.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="font-medium text-ink hover:text-accent"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-12 font-display text-xl font-semibold text-ink">Publikasi</h2>
        {papers.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Belum ada karya yang ditandai topik ini. Penandaan menyusul di data,
            tidak diisi perkiraan.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {papers.map((paper) => (
              <li key={paper.id}>
                <a href={paper.href} className="font-medium text-ink hover:text-accent">
                  {paper.title}
                </a>
                <p className="text-sm text-muted">
                  {paper.year} · {paper.venue}
                </p>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-12 font-display text-xl font-semibold text-ink">Alat</h2>
        {tools.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Belum ada alat pada topik ini.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {tools.map((tool) => (
              <li key={tool.id}>
                <a href={tool.href} className="text-accent hover:underline">
                  {tool.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
