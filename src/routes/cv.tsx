import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { CvPage } from "@/components/portfolio/cv-page";
import { Experience } from "@/components/portfolio/experience";

export const Route = createFileRoute("/cv")({
  component: CvRoute,
  head: () => ({
    meta: [
      { title: "CV — Muhamad Abduh" },
      {
        name: "description",
        content:
          "English curriculum vitae of Muhamad Abduh — education, roles, experience, and selected reviewing.",
      },
    ],
  }),
});

function CvRoute() {
  return (
    <SiteShell>
      <CvPage />
      <Experience />
    </SiteShell>
  );
}
