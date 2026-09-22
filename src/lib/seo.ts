/**
 * Shared site SEO helpers for muhabduh.id
 */

export const SITE_URL = "https://muhabduh.id";
export const SITE_NAME = "Muhamad Abduh";
export const DEFAULT_TITLE = "Muhamad Abduh — Civil Engineering · ITB";
export const DEFAULT_DESCRIPTION =
  "Muhamad Abduh teaches and researches civil engineering at Institut Teknologi Bandung — lean construction, sustainability, and construction management. Don't be afraid to care.";

export type PageSeo = {
  title: string;
  description: string;
  /** Path starting with /, e.g. /research */
  path?: string;
  image?: string;
};

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Meta + link tags for a page (merge with root defaults in route head). */
export function pageHead({
  title,
  description,
  path = "/",
  image = `${SITE_URL}/portrait.jpg`,
}: PageSeo) {
  const url = absoluteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/** Schema.org Person for the site owner (JSON-LD). */
export function personJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Muhamad Abduh",
    givenName: "Muhamad",
    familyName: "Abduh",
    url: SITE_URL,
    image: `${SITE_URL}/portrait.jpg`,
    jobTitle: "Professor of Civil Engineering",
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: "Institut Teknologi Bandung",
      url: "https://www.itb.ac.id",
    },
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Institut Teknologi Bandung",
    },
    email: "mailto:abduh@itb.ac.id",
    sameAs: [
      "https://orcid.org/0000-0001-6926-6665",
      "https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en",
      "https://scholar.itb.ac.id/profile/muhamad-abduh_40559",
      "https://www.linkedin.com/in/muhamad-abduh-5626666",
      "https://www.itb.ac.id/staff/view/muhamad-abduh-stw",
      "https://x.com/mabdas",
    ],
    knowsAbout: [
      "Lean construction",
      "Construction management",
      "Sustainable construction",
      "Construction supply chains",
      "Construction operations",
    ],
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify(data),
  };
}
