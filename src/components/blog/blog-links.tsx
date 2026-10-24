import { Link } from "@tanstack/react-router";

/** Shown on an existing English page only when a published post points here. */
export function DiscussedOnBlog({
  posts,
}: {
  posts: { slug: string; title: string }[];
}) {
  if (posts.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
        Dibahas di blog
      </p>
      <ul className="mt-1 space-y-1">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="text-sm text-accent hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
