import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old /news URLs 404'd. The blog is the replacement. */
export const Route = createFileRoute("/news")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", statusCode: 301 });
  },
});
