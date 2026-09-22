import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Contact } from "@/components/portfolio/contact";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  component: ContactRoute,
  head: () =>
    pageHead({
      title: "Contact — Muhamad Abduh",
      description:
        "Email, office, and links to reach Muhamad Abduh at ITB — teaching, research, and collaboration.",
      path: "/contact",
    }),
});

function ContactRoute() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Contact />
      </div>
    </SiteShell>
  );
}
