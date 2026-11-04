import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/snapshot")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handlePostSnapshot } = await import("@/lib/dashboard/handlers.server");
        return handlePostSnapshot(request);
      },
      GET: async () => {
        const { methodNotAllowed } = await import("@/lib/dashboard/handlers.server");
        return methodNotAllowed();
      },
    },
  },
});
