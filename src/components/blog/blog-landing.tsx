import { Link } from "@tanstack/react-router";
import type { PostCard, TopicCard } from "@/lib/content/types";

function formatDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogLanding({
  topics,
  posts,
}: {
  topics: TopicCard[];
  posts: PostCard[];
}) {
  return (
    <article className="section-pad pb-20 pt-28">
      <div className="container-narrow">
        <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
          Blog
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Memulai dengan Bertanya
        </h1>
        <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted">
          <p>
            Seri ini menuliskan penelitian Muhamad Abduh supaya lebih mudah
            diikuti. Setiap tulisan dimulai dari satu pertanyaan.
          </p>
          <p>
            Pertanyaan itu berangkat dari situasi di penelitian Abduh sendiri —
            di proyek, di kelas, atau di data lapangan — bukan dari slogan, dan
            bukan untuk memamerkan paper.
          </p>
          <p>
            Nama seri terinspirasi cara Socrates bertanya. Ini bukan kutipan
            Socrates.
          </p>
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold tracking-tight text-ink">
          Kategori
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Link
                to="/topik/$topik"
                params={{ topik: topic.slug }}
                className="block rounded-xl border border-border bg-surface p-5 shadow-soft transition-colors hover:border-accent/30"
              >
                <span className="font-display text-lg font-semibold text-ink">
                  {topic.name}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">
                  {topic.blurb}
                </span>
                <span className="mt-3 block text-xs font-medium text-accent">
                  {topic.postCount === 0
                    ? "Belum ada tulisan"
                    : `${topic.postCount} tulisan`}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 font-display text-2xl font-semibold tracking-tight text-ink">
          Tulisan dan pembaruan
        </h2>
        {posts.length === 0 ? (
          <p className="mt-4 max-w-2xl text-muted leading-relaxed">
            Belum ada tulisan terbit. Pembaruan akan muncul di daftar ini
            setelah sebuah tulisan disetujui dan masuk repositori.
          </p>
        ) : (
          <ol className="mt-6 divide-y divide-border border-y border-border">
            {posts.every((post) => post.draft) ? (
              <li className="py-4 text-sm leading-relaxed text-muted">
                Tulisan di bawah ini masih draf. Mereka tampil di pratinjau dan
                belum masuk situs yang sudah terbit.
              </li>
            ) : null}
            {posts.map((post) => (
              <li key={post.slug} className="py-5">
                <p className="text-xs text-subtle">
                  {post.draft ? (
                    <span className="mr-2 font-semibold uppercase tracking-wide text-accent">
                      Draf
                    </span>
                  ) : null}
                  {formatDate(post.date)}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                  {post.description}
                </p>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-8 text-sm text-muted">
          <a
            href="/rss.xml"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Langganan lewat RSS
          </a>
          <span aria-hidden> · </span>
          <Link
            to="/publikasi"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Daftar publikasi
          </Link>
        </p>
      </div>
    </article>
  );
}
