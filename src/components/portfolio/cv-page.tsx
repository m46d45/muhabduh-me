import { ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  awards,
  education,
  roles,
  type TimelineItem,
} from "@/data/cv-timeline";

function TimelineBlock({
  heading,
  items,
}: {
  heading: string;
  items: TimelineItem[];
}) {
  return (
    <div className="mt-12">
      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-subtle">
        {heading}
      </h3>
      <ol className="mt-4 space-y-0">
        {items.map((item) => (
          <li
            key={item.title + item.period}
            className="relative grid gap-2 border-t border-border py-5 sm:grid-cols-[9.5rem_1fr] sm:gap-8"
          >
            <time className="font-mono text-xs tabular-nums text-subtle sm:pt-1 sm:text-sm">
              {item.period}
            </time>
            <div>
              <h4 className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
                {item.title}
              </h4>
              <p className="mt-0.5 text-sm text-accent">{item.org}</p>
              {item.note && (
                <p className="mt-1 text-sm text-muted">{item.note}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CvPage() {
  return (
    <section className="section-pad border-t border-border pb-24 pt-28 sm:pb-28 sm:pt-32">
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Curriculum vitae
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Muhamad Abduh — English CV
          </h1>
          <p className="mt-4 text-muted leading-relaxed">
            Professor of Civil Engineering at Institut Teknologi Bandung.
            Focus: lean construction, operations, sustainability, and
            construction management. This page is the public CV door for{" "}
            <a
              href="https://muhabduh.id"
              className="text-accent underline-offset-2 hover:underline"
            >
              muhabduh.id
            </a>
            .
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a
              href="https://orcid.org/0000-0001-6926-6665"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-ink hover:border-accent/40 hover:text-accent"
            >
              ORCID
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-ink hover:border-accent/40 hover:text-accent"
            >
              Google Scholar
              <ExternalLink className="h-3 w-3" />
            </a>
            <Link
              to="/publications"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-ink hover:border-accent/40 hover:text-accent"
            >
              Publications
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-teal-wash px-3 py-1.5 text-accent hover:border-accent/50"
            >
              Contact
            </Link>
          </div>
        </div>

        <TimelineBlock heading="Education" items={education} />
        <TimelineBlock heading="Academic & leadership roles" items={roles} />
        <TimelineBlock heading="Selected awards" items={awards} />

        <p className="mt-14 max-w-2xl text-xs leading-relaxed text-subtle">
          Private or draft CV materials (e.g. older Bitly / Sway links) are not
          the visitor-facing primary CV. Prefer this page and ORCID / Scholar
          for public reference.
        </p>
      </div>
    </section>
  );
}
