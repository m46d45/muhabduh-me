import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/nav";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Mantra } from "@/components/portfolio/mantra";
import { Experience } from "@/components/portfolio/experience";
import { Research } from "@/components/portfolio/research";
import { Teaching } from "@/components/portfolio/teaching";
import { Projects } from "@/components/portfolio/projects";
import { Software } from "@/components/portfolio/software";
import { Articles } from "@/components/portfolio/articles";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";

export const Route = createFileRoute("/")({
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <div className="min-h-svh">
      <Nav />
      <main>
        <Hero />
        <About />
        <Mantra />
        <Experience />
        <Research />
        <Teaching />
        <Projects />
        <Software />
        <Articles />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
