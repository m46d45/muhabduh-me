import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Contact } from "@/components/portfolio/contact";

export const Route = createFileRoute("/contact")({
  component: ContactRoute,
  head: () => ({
    meta: [{ title: "Contact — Muhamad Abduh" }],
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
