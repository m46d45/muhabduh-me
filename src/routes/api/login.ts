import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handlePostLogin } = await import("@/lib/dashboard/handlers.server");
        return handlePostLogin(request);
      },
      GET: async () => {
        const { methodNotAllowed } = await import("@/lib/dashboard/handlers.server");
        return methodNotAllowed();
      },
    },
  },
});
