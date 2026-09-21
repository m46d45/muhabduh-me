import type { ReactNode } from "react";
import { SiteNav } from "@/components/layout/site-nav";
import { Footer } from "@/components/portfolio/footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh">
      <SiteNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
