import { createFileRoute } from "@tanstack/react-router";
import { DashboardScreen } from "@/components/dashboard/dashboard-screen";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dasbor harian" },
      { name: "description", content: "Halaman pribadi." },
      { name: "robots", content: "noindex, nofollow" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return <DashboardScreen />;
}
