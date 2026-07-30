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
              Building better construction through knowledge and care
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
                  Chairman, IAMKRI
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
                <span className="text-subtle">Scholar</span>
                <br />
                <span className="text-ink">1,140+ citations (Google Scholar)</span>
              </li>
            </ul>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            <p>
              I am a professor of civil engineering at{" "}
              <a
                href="https://www.itb.ac.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                Institut Teknologi Bandung (ITB)
              </a>
              , working at the intersection of construction practice, research,
              and education. My work centers on how projects, organizations, and
              supply chains can deliver better outcomes with less waste —
              technically, environmentally, and humanly.
            </p>
            <p>
              Over many years I have contributed to lean construction and
              sustainable construction in Indonesia and internationally:
              publishing research, advising industry and government partners,
              and teaching engineers who will shape the built environment. I also
              serve as Chairman of{" "}
              <a
                href="https://iamkri.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                IAMKRI
              </a>
              , the Indonesian professional society for lean construction
              management.
            </p>
            <p>
              The thread through it all is simple:{" "}
              <span className="font-display italic text-ink">
                don't be afraid to care
              </span>
              . Care for quality of work, for people on site and in the
              classroom, and for construction systems that serve the public
              good — not as a slogan alone, but as a daily discipline.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
