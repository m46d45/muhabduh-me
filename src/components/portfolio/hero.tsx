import { ArrowDown, ArrowRight, ContactRound, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recordLinkClick } from "@/components/portfolio/link-stats";

export function Hero() {
  return (
    <section
      id="top"
      className="section-pad relative flex min-h-[100svh] items-center pb-20 pt-28"
    >
      <div className="container-narrow relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div className="order-2 lg:order-1">
          <div className="fade-up rule-accent mb-6" />
          <p className="fade-up mb-4 text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Professor · Civil Engineering · ITB
          </p>
          <h1 className="fade-up stagger-1 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            Muhamad Abduh
          </h1>

          <p className="fade-up stagger-2 mt-6 max-w-lg font-display text-2xl font-medium italic leading-snug tracking-tight text-ink sm:text-3xl sm:leading-snug">
            Don't be afraid to care...
          </p>

          <p className="fade-up stagger-3 mt-5 max-w-xl text-lg text-muted leading-relaxed">
            I teach and do research in civil engineering at Institut Teknologi
            Bandung, with a focus on lean construction, sustainability, and
            construction management — learning with students, colleagues, and
            practitioners along the way.
          </p>
          <div className="fade-up stagger-4 mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="md:hidden">
              <a
                href="/muhamad-abduh.vcf"
                onClick={() => {
                  void recordLinkClick("save-contact");
                }}
              >
                <ContactRound className="h-4 w-4" />
                Save contact
              </a>
            </Button>
            <Button asChild size="lg">
              <a href="#research">
                View research
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
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
          <p className="fade-up stagger-4 mt-3 text-xs text-subtle md:hidden">
            Saves my name, email, and phone numbers to your contacts.
          </p>
          <a
            href="#bio"
            className="fade-up stagger-4 mt-14 inline-flex items-center gap-2 text-sm text-subtle transition-colors hover:text-muted"
          >
            Scroll to explore
            <ArrowDown className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
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
                alt="Portrait of Muhamad Abduh"
                width={420}
                height={520}
                className="aspect-[4/5] w-64 object-cover object-top sm:w-72 lg:w-80"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
