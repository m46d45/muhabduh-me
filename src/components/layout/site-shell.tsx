import type { ReactNode } from "react";
import { SiteNav } from "@/components/layout/site-nav";
import { Footer } from "@/components/portfolio/footer";

export function SiteShell({
  children,
  homeScrollSpy = false,
}: {
  children: ReactNode;
  /** Enable section scroll-spy only on the long homepage */
  homeScrollSpy?: boolean;
}) {
  return (
    <div className="min-h-svh">
      <SiteNav homeScrollSpy={homeScrollSpy} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
