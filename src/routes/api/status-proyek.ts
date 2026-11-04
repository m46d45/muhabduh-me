import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/status-proyek")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handlePostStatusProyek } = await import("@/lib/dashboard/handlers.server");
        return handlePostStatusProyek(request);
      },
      GET: async () => {
        const { methodNotAllowed } = await import("@/lib/dashboard/handlers.server");
        return methodNotAllowed();
      },
    },
  },
});
