import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "@/styles.css?url";

const SITE_URL = "https://muhabduh.id";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Muhamad Abduh — Civil Engineering · ITB",
      },
      {
        name: "description",
        content:
          "Muhamad Abduh teaches and researches civil engineering at Institut Teknologi Bandung — lean construction, sustainability, and construction management. Don't be afraid to care.",
      },
      { name: "theme-color", content: "#f4f1ea" },
      {
        name: "author",
        content: "Muhamad Abduh",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      {
        property: "og:title",
        content: "Muhamad Abduh — Civil Engineering · ITB",
      },
      {
        property: "og:description",
        content:
          "Teaching and research in lean construction and construction management at ITB. Don't be afraid to care.",
      },
      {
        property: "og:image",
        content: `${SITE_URL}/portrait.jpg`,
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:url", content: SITE_URL },
      {
        name: "twitter:image",
        content: `${SITE_URL}/portrait.jpg`,
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-svh bg-bg text-fg">
        {children}
        <Toaster
          theme="light"
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "bg-surface border border-border text-fg shadow-soft",
              title: "text-fg",
              description: "text-muted",
            },
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
