import { ArrowDown, ArrowRight, ContactRound, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { recordLinkClick } from "@/components/portfolio/link-stats";

export function Hero() {
  return (
    <section
      id="top"
      className="section-pad relative flex items-center pb-10 pt-20 md:min-h-[88svh] md:pb-16 md:pt-28"
    >
      <div className="container-narrow relative grid items-center gap-5 md:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {/* Mobile-first: portrait + VCF above the fold, then name/CTAs */}
        <div className="order-1 flex flex-col items-center md:hidden">
          <div className="relative">
            <div
              className="absolute -inset-2 rounded-[1.25rem] bg-accent/15"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
              <img
                src="/portrait.jpg"
                alt="Portrait of Muhamad Abduh, professor of civil engineering at ITB"
                width={420}
                height={520}
                className="aspect-[4/5] w-36 object-cover object-top"
              />
            </div>
          </div>
          <h1 className="mt-4 text-center font-display text-2xl font-semibold tracking-tight text-ink">
            Muhamad Abduh
          </h1>
          <p className="mt-1 text-center text-xs font-semibold tracking-[0.06em] uppercase text-accent">
            Professor · Civil Engineering · ITB
          </p>
          <Button asChild size="lg" className="mt-4 w-full max-w-xs">
            <a
              href="/muhamad-abduh.vcf"
              onClick={() => {
                void recordLinkClick("save-contact");
              }}
            >
              <ContactRound className="h-4 w-4" />
              Save contact to phone
            </a>
          </Button>
          <p className="mt-1.5 text-center text-xs text-subtle">
            Saves name, email, and phone to your contacts.
          </p>
        </div>

        <div className="order-2 lg:order-1">
          <div className="fade-up rule-accent mb-6 hidden md:block" />
          <p className="fade-up mb-4 hidden text-sm font-semibold tracking-[0.08em] uppercase text-accent md:block">
            Professor · Civil Engineering · ITB
          </p>
          <h1 className="fade-up stagger-1 hidden font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:block lg:text-[3.5rem] lg:leading-[1.1]">
            Muhamad Abduh
          </h1>

          <p className="fade-up stagger-2 mt-2 max-w-xl text-base text-muted leading-relaxed md:mt-5 md:text-lg">
            I teach and do research in civil engineering at Institut Teknologi
            Bandung, with a focus on lean construction, sustainability, and
            construction management — learning with students, colleagues, and
            practitioners along the way.
          </p>
          <div className="fade-up stagger-3 mt-6 flex flex-wrap items-center gap-3 md:mt-9">
            <Button asChild size="lg">
              <Link to="/research">
                View research
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/cv">
                Curriculum vitae
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a
                href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Scholar
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
          <a
            href="#bio"
            className="fade-up stagger-4 mt-8 inline-flex items-center gap-2 text-sm text-subtle transition-colors hover:text-muted md:mt-14"
          >
            Scroll to explore
            <ArrowDown className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="order-1 hidden flex-col items-center md:flex lg:order-2 lg:items-end">
          <div className="fade-up stagger-2 relative">
            <div
              className="absolute -inset-3 rounded-[1.5rem] bg-accent/15"
              aria-hidden
            />
            <div
              className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full border border-accent/20"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
              <img
                src="/portrait.jpg"
                alt="Portrait of Muhamad Abduh, professor of civil engineering at ITB"
                width={420}
                height={520}
                className="aspect-[4/5] w-56 object-cover object-top sm:w-72 lg:w-80"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
