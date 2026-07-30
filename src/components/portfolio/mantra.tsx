export function Mantra() {
  return (
    <section
      aria-label="Personal motto"
      className="section-pad border-t border-border bg-accent py-16 sm:py-20"
    >
      <div className="container-narrow text-center">
        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-accent-fg/70">
          Guiding principle
        </p>
        <blockquote className="mx-auto mt-5 max-w-3xl">
          <p className="font-display text-3xl font-medium italic leading-snug tracking-tight text-accent-fg sm:text-4xl md:text-[2.75rem] md:leading-tight">
            Don't be afraid to care.
          </p>
        </blockquote>
        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-accent-fg/75">
          Care for learners, for craft on site, and for construction systems
          that serve people — even when speed and status pull the other way.
        </p>
      </div>
    </section>
  );
}
