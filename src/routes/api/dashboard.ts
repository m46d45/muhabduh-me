import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/dashboard")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { handleGetDashboard } = await import("@/lib/dashboard/handlers.server");
        return handleGetDashboard(request);
      },
    },
  },
});
