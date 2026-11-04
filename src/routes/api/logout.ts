import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handlePostLogout } = await import("@/lib/dashboard/handlers.server");
        return handlePostLogout(request);
      },
    },
  },
});
