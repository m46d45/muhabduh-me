import { Link } from "@tanstack/react-router";

type Paper = {
  id: string;
  title: string;
  year: string;
  venue: string;
  href: string | null;
  authors: string | null;
  doi: string | null;
  summary: string | null;
  verified: boolean;
  status: string | null;
};

type LinkItem = {
  id: string;
  title: string;
  href: string;
  appUrl?: string | null;
};

type Related = {
  slug: string;
  title: string;
};

export type BlogPostView = {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft: boolean;
  /** Optional square illustration. Absent means no image slot at all. */
  image?: string | null;
  html: string;
  topics: { slug: string; name: string }[];
  papers: Paper[];
  tools: LinkItem[];
  courses: LinkItem[];
  related: Related[];
  lean: boolean;
};

function formatDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogPost({ post }: { post: BlogPostView }) {
  return (
    <article className="section-pad pb-20 pt-28">
      <div className="container-narrow max-w-3xl">
        <p className="text-sm text-subtle">
          <Link to="/blog" className="text-accent hover:underline">
            Memulai dengan Bertanya
          </Link>
          <span aria-hidden> · </span>
          {post.draft ? (
            <span className="font-semibold uppercase tracking-wide text-accent">
              Draf
            </span>
          ) : (
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          )}
        </p>
        <div className={post.image ? "mt-3 flex items-start gap-4" : "mt-3"}>
          {/*
            Optional square illustration from front matter `image`.
            Spec (README, Ilustrasi tulisan): WebP, 800×800, subject centered,
            under 80 KB, in public/blog/. No image means this slot is omitted.
          */}
          {post.image ? (
            <img
              src={post.image}
              alt=""
              width={96}
              height={96}
              className="h-20 w-20 shrink-0 rounded-lg border border-border object-cover sm:h-24 sm:w-24"
            />
          ) : null}
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {post.title}
          </h1>
        </div>
        <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.topics.map((topic) => (
            <li key={topic.slug}>
              <Link
                to="/topik/$topik"
                params={{ topik: topic.slug }}
                className="rounded-full border border-accent/25 bg-teal-wash px-2.5 py-0.5 text-xs font-medium text-accent"
              >
                {topic.name}
              </Link>
            </li>
          ))}
        </ul>

        <div
          className="blog-prose mt-8 max-w-2xl text-base leading-relaxed text-fg"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <section className="mt-12 rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Sumber riset</h2>
          {post.papers.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Belum ada paper sumber.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {post.papers.map((paper) => (
                <li key={paper.id}>
                  {paper.href ? (
                    <a
                      href={paper.href}
                      className="font-medium text-ink underline-offset-2 hover:text-accent hover:underline"
                    >
                      {paper.title}
                    </a>
                  ) : (
                    <p className="font-medium text-ink">{paper.title}</p>
                  )}
                  <p className="mt-1 text-sm text-muted">
                    {paper.year ? `${paper.year} · ` : ""}
                    {paper.venue}
                    {paper.authors ? ` · ${paper.authors}` : ""}
                    {paper.status === "in-press" ? " · dalam proses terbit" : ""}
                  </p>
                  {paper.verified ? null : (
                    <p className="mt-1 text-sm text-muted">
                      Entri ini belum terverifikasi, jadi tidak masuk daftar publikasi.
                    </p>
                  )}
                  {paper.doi ? (
                    <p className="mt-1 text-sm">
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        className="text-accent hover:underline"
                      >
                        doi:{paper.doi}
                      </a>
                    </p>
                  ) : null}
                  {paper.summary ? (
                    <p className="mt-1 text-sm text-muted">{paper.summary}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        {post.tools.length > 0 || post.courses.length > 0 ? (
          <section className="mt-6 rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Dipakai di kelas / coba sendiri
            </h2>
            {post.courses.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm">
                {post.courses.map((course) => (
                  <li key={course.id}>
                    <a href={course.href} className="text-accent hover:underline">
                      {course.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {post.tools.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm">
                {post.tools.map((tool) => (
                  <li key={tool.id}>
                    <a href={tool.href} className="text-accent hover:underline">
                      {tool.title}
                    </a>
                    {tool.appUrl ? (
                      <>
                        <span aria-hidden> · </span>
                        <a
                          href={tool.appUrl}
                          className="text-muted hover:text-accent"
                        >
                          Buka simulasi
                        </a>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        {post.related.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-ink">
              Tulisan lain
            </h2>
            <ul className="mt-3 space-y-2">
              {post.related.map((item) => (
                <li key={item.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: item.slug }}
                    className="text-accent hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {post.lean ? (
          <p className="mt-10 text-sm leading-relaxed text-muted">
            Topik lean di seri ini juga menaut ke{" "}
            <a
              href="https://iamkri.id"
              className="text-accent hover:underline"
            >
              IAMKRI
            </a>{" "}
            dan{" "}
            <a
              href="https://lci-international.net/"
              className="text-accent hover:underline"
            >
              LCI International
            </a>
            .
          </p>
        ) : null}
      </div>
    </article>
  );
}
