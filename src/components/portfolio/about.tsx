import { ExternalLink } from "lucide-react";

export function About() {
  return (
    <section id="bio" className="section-pad border-t border-border py-24 sm:py-28">
      <div className="container-narrow">
        <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
              About
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Learning how construction can work better
            </h2>
            <div className="rule-accent mt-6" />
            <ul className="mt-8 space-y-3 text-sm text-muted">
              <li>
                <span className="text-subtle">Affiliation</span>
                <br />
                <a
                  href="https://www.itb.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-ink hover:text-accent"
                >
                  Faculty of Civil & Environmental Engineering, ITB
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="text-subtle">Professional society</span>
                <br />
                <a
                  href="https://iamkri.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-ink hover:text-accent"
                >
                  IAMKRI (lean construction community)
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="text-subtle">Focus</span>
                <br />
                <span className="text-ink">
                  Lean · Sustainable · Supply chains · Operations · IT in
                  construction
                </span>
              </li>
              <li>
                <span className="text-subtle">Writing & research</span>
                <br />
                <a
                  href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-ink hover:text-accent"
                >
                  Google Scholar profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            <p>
              I work as a professor of civil engineering at{" "}
              <a
                href="https://www.itb.ac.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                Institut Teknologi Bandung (ITB)
              </a>
              . Much of my time is spent teaching, writing, and talking with
              people in the industry about how projects and organizations can
              reduce waste — of material, time, and human effort.
            </p>
            <p>
              Over the years I have been fortunate to take part in research on
              lean and sustainable construction in Indonesia and abroad, and to
              serve the professional community through{" "}
              <a
                href="https://iamkri.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                IAMKRI
              </a>
              . Any useful outcomes have always been shared work — with
              students, co-authors, and practitioners.
            </p>
            <p>
              What I try to hold on to is simple:{" "}
              <span className="font-display italic text-ink">
                don't be afraid to care
              </span>
              . Care for the quality of the work, for people on site and in the
              classroom, and for construction that serves the public — not as a
              claim, but as a daily practice I keep learning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
