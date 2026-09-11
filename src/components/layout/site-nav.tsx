import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/cv", label: "CV" },
  { to: "/publications", label: "Publications" },
  { to: "/teaching", label: "Teaching" },
  { to: "/research", label: "Research" },
  { to: "/tools", label: "Tools" },
  { to: "/calendar", label: "Calendar" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav({ homeScrollSpy = false }: { homeScrollSpy?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [homeScrollSpy]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-250",
        scrolled
          ? "border-b border-border/90 bg-bg/92 backdrop-blur-md shadow-soft"
          : "bg-transparent",
      )}
    >
      <div className="container-narrow section-pad flex h-16 items-center justify-between gap-4 lg:gap-6">
        <Link
          to="/"
          className="group min-w-0 max-w-[11rem] shrink leading-tight sm:max-w-[14rem]"
          onClick={closeMenu}
          title="Don't be afraid to care."
        >
          <span className="block truncate font-display text-[0.95rem] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-base">
            Muhamad Abduh
          </span>
          <span className="mt-0.5 block truncate text-[0.7rem] font-medium tracking-tight text-subtle sm:text-xs">
            Civil Engineering · ITB
          </span>
        </Link>

        {/* Hybrid A: home keeps a minimal header — section doors live in Explore */}
        {isHome ? (
          <Button asChild size="sm">
            <Link to="/contact" onClick={closeMenu}>
              Contact
            </Link>
          </Button>
        ) : (
          <>
            <nav
              className="hidden items-center gap-0 xl:flex"
              aria-label="Primary"
            >
              {links.map((link) => {
                const isActive =
                  pathname === link.to || pathname.startsWith(link.to + "/");
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className={cn(
                      "relative rounded-md px-2.5 py-2 text-[0.8125rem] transition-colors duration-150",
                      isActive
                        ? "font-medium text-ink"
                        : "text-muted hover:text-ink",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute inset-x-2 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-200",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/contact" onClick={closeMenu}>
                  Contact
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </>
        )}
      </div>

      {!isHome && open && (
        <div className="border-t border-border bg-bg/98 backdrop-blur-md xl:hidden">
          <nav
            className="container-narrow section-pad flex flex-col gap-0.5 py-3"
            aria-label="Mobile"
          >
            <Link
              to="/"
              onClick={closeMenu}
              className={cn(
                "rounded-md px-3 py-3 text-base transition-colors",
                pathname === "/"
                  ? "bg-teal-wash font-medium text-ink"
                  : "text-muted hover:bg-surface hover:text-ink",
              )}
            >
              Home
            </Link>
            {links.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={cn(
                    "rounded-md px-3 py-3 text-base transition-colors",
                    isActive
                      ? "bg-teal-wash font-medium text-ink"
                      : "text-muted hover:bg-surface hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
