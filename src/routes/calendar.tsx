import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Calendar } from "@/components/portfolio/calendar";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/calendar")({
  component: CalendarRoute,
  head: () =>
    pageHead({
      title: "Calendar — Muhamad Abduh",
      description:
        "Public seminars and conferences calendar monitored by Muhamad Abduh (Asia/Jakarta).",
      path: "/calendar",
    }),
});

function CalendarRoute() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Calendar />
      </div>
    </SiteShell>
  );
}
