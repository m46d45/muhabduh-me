import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/keputusan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handlePostKeputusan } = await import("@/lib/dashboard/handlers.server");
        return handlePostKeputusan(request);
      },
    },
  },
});
