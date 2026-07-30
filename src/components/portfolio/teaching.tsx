import { GraduationCap, Users, Mic2 } from "lucide-react";

const teaching = [
  {
    icon: GraduationCap,
    title: "University teaching",
    items: [
      "Civil engineering & construction management at FTSL ITB",
      "Lean construction concepts and project delivery practice",
      "Graduate and undergraduate mentoring in construction research",
    ],
  },
  {
    icon: Users,
    title: "Professional community",
    items: [
      "Chairman of IAMKRI (lean construction management society)",
      "Capacity building for contractors and project organizations",
      "Dialogue between academia, industry, and policy stakeholders",
    ],
  },
  {
    icon: Mic2,
    title: "Seminars & invited roles",
    items: [
      "National seminars on lean construction policy enrichment",
      "Conference leadership and contributions (e.g. ConCERN, GOBUILD)",
      "Knowledge sharing on sustainable and productive construction",
    ],
  },
];

export function Teaching() {
  return (
    <section
      id="teaching"
      className="section-pad border-t border-border bg-bg-deep/40 py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Teaching
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Classrooms, profession, and public learning
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Teaching at ITB and educating the wider construction community —
            students, practitioners, and institutions — on how to build better.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {teaching.map((block) => {
            const Icon = block.icon;
            return (
              <article
                key={block.title}
                className="rounded-xl border border-border bg-surface p-6 shadow-soft sm:p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-teal-wash text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">
                  {block.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="border-t border-border pt-3 text-sm leading-relaxed text-muted first:border-t-0 first:pt-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
