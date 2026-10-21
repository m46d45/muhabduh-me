import { createServerFn } from "@tanstack/react-start";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readSlug(input: unknown) {
  if (!input || typeof input !== "object" || !("slug" in input)) {
    throw new Error("slug wajib");
  }
  const slug = (input as { slug: unknown }).slug;
  if (typeof slug !== "string" || !slugPattern.test(slug)) {
    throw new Error("slug tidak valid");
  }
  return { slug };
}

export const fetchBlogIndex = createServerFn({ method: "GET" }).handler(
  async () => {
    const { blogIndex } = await import("./load.server");
    return blogIndex();
  },
);

export const fetchPost = createServerFn({ method: "GET" })
  .validator(readSlug)
  .handler(async ({ data }) => {
    const { postBySlug } = await import("./load.server");
    return postBySlug(data.slug);
  });

export const fetchTopic = createServerFn({ method: "GET" })
  .validator(readSlug)
  .handler(async ({ data }) => {
    const { topicPage } = await import("./load.server");
    return topicPage(data.slug);
  });

export const fetchPapers = createServerFn({ method: "GET" }).handler(
  async () => {
    const { papersPage } = await import("./load.server");
    return papersPage();
  },
);

export const fetchToolPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const { postsByTool } = await import("./load.server");
    return postsByTool();
  },
);

export const fetchCoursePosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const { postsByCourse } = await import("./load.server");
    return postsByCourse();
  },
);
