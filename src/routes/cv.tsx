import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { CvPage } from "@/components/portfolio/cv-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/cv")({
  component: CvRoute,
  head: () =>
    pageHead({
      title: "CV — Muhamad Abduh",
      description:
        "English curriculum vitae of Muhamad Abduh — education, academic roles, and awards.",
      path: "/cv",
    }),
});

function CvRoute() {
  return (
    <SiteShell>
      <CvPage />
    </SiteShell>
  );
}
