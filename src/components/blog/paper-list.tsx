import { Link } from "@tanstack/react-router";

export type PaperRow = {
  id: string;
  title: string;
  year: string;
  venue: string;
  kind: string;
  href: string | null;
  authors: string | null;
  doi: string | null;
  summary: string | null;
  topics: string[];
  status: string | null;
  posts: { slug: string; title: string }[];
};

const kindLabel: Record<string, string> = {
  paper: "Paper",
  journal: "Jurnal",
  chapter: "Bab",
  conference: "Konferensi",
  book: "Buku",
  article: "Artikel",
};

export function PaperList({
  heading,
  lede,
  papers,
}: {
  heading: string;
  lede: string;
  papers: PaperRow[];
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
          {heading}
        </h1>
        <p className="mt-4 max-w-2xl text-muted leading-relaxed">{lede}</p>
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {papers.map((paper) => (
            <li key={paper.id} id={paper.id} className="py-6">
              <p className="text-xs uppercase tracking-wide text-subtle">
                {paper.year ? `${paper.year} · ` : ""}
                {kindLabel[paper.kind] ?? paper.kind}
                {paper.status === "in-press" ? " · dalam proses terbit" : ""}
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-ink">
                {paper.href ? (
                  <a href={paper.href} className="hover:text-accent">
                    {paper.title}
                  </a>
                ) : (
                  paper.title
                )}
              </h2>
              <p className="mt-1 text-sm text-muted">{paper.venue}</p>
              {paper.authors ? (
                <p className="mt-1 text-sm text-muted">{paper.authors}</p>
              ) : null}
              {paper.summary ? (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                  {paper.summary}
                </p>
              ) : null}
              {paper.doi ? (
                <p className="mt-2 text-sm">
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    className="text-accent hover:underline"
                  >
                    doi:{paper.doi}
                  </a>
                </p>
              ) : null}
              {paper.posts.length > 0 ? (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
                    Dibahas di blog
                  </p>
                  <ul className="mt-1 space-y-1">
                    {paper.posts.map((post) => (
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
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
