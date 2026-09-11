import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Mantra } from "@/components/portfolio/mantra";
import { News } from "@/components/portfolio/news";
import { HomeCalendarTeaser } from "@/components/portfolio/home-calendar-teaser";
import { HomeHighlights } from "@/components/portfolio/home-highlights";
import { Contact } from "@/components/portfolio/contact";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <About />
      <Mantra />
      <News />
      <HomeCalendarTeaser />
      <HomeHighlights />
      <Contact />
    </SiteShell>
  );
}
