import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "@/styles.css?url";
import { jsonLdScript, personJsonLd } from "@/lib/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { name: "theme-color", content: "#f4f1ea" },
      { name: "author", content: "Muhamad Abduh" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    scripts: [jsonLdScript(personJsonLd())],
  }),
  component: RootComponent,
});

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const lang = /^\/(blog|topik|publikasi|riset)(\/|$)/.test(pathname) ? "id" : "en";
  return (
    <RootDocument lang={lang}>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({
  children,
  lang,
}: Readonly<{ children: ReactNode; lang: "en" | "id" }>) {
  return (
    <html lang={lang} className="antialiased">
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
