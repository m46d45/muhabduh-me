import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Calendar } from "@/components/portfolio/calendar";

export const Route = createFileRoute("/calendar")({
  component: CalendarRoute,
  head: () => ({
    meta: [
      { title: "Calendar — Muhamad Abduh" },
      {
        name: "description",
        content:
          "Seminars and conferences calendar monitored by Muhamad Abduh.",
      },
    ],
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
