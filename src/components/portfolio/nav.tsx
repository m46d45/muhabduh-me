import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Faculty-style primary nav: fewer items, clear hierarchy, one CTA.
 * Scroll-spy: last section whose document top is at or above the spy line
 * (below the sticky header). Click sets active immediately.
 */
const links = [
  { href: "#bio", label: "About", id: "bio" },
  { href: "#experience", label: "Experience", id: "experience" },
  { href: "#research", label: "Research", id: "research" },
  { href: "#teaching", label: "Teaching", id: "teaching" },
  { href: "#articles", label: "Publications", id: "articles" },
] as const;

const SECTION_ORDER = [
  "bio",
  "experience",
  "research",
  "teaching",
  "projects",
  "articles",
  "contact",
] as const;

function toNavId(sectionId: string): string {
  if (sectionId === "projects") return "research";
  return sectionId;
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    function resolveActive(): string {
      // Spy line just under the fixed header (matches scroll-margin-top ~5rem)
      const spyLine = window.scrollY + 96;
      let current: string = SECTION_ORDER[0];

      for (const id of SECTION_ORDER) {
        const el = document.getElementById(id);
        if (!el) continue;
        const docTop = el.getBoundingClientRect().top + window.scrollY;
        if (docTop <= spyLine) {
          current = id;
        }
      }

      // Near bottom of page → last section
      const docHeight = document.documentElement.scrollHeight;
      const viewBottom = window.scrollY + window.innerHeight;
      if (viewBottom >= docHeight - 8) {
        current = SECTION_ORDER[SECTION_ORDER.length - 1];
      }

      return toNavId(current);
    }

    function onScroll() {
      setScrolled(window.scrollY > 16);
      setActive(resolveActive());
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const t = window.setTimeout(onScroll, 150);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  function onNavClick(id: string) {
    setActive(id);
    closeMenu();
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
      <div className="container-narrow section-pad flex h-16 items-center justify-between gap-6">
        <a
          href="#top"
          className="group shrink-0 leading-tight"
          onClick={() => {
            setActive("");
            closeMenu();
          }}
        >
          <span className="block font-display text-[0.95rem] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-base">
            Muhamad Abduh
          </span>
          <span className="hidden text-[0.65rem] font-medium uppercase tracking-[0.12em] text-subtle sm:block">
            Professor · ITB
          </span>
        </a>

        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label="Primary"
        >
          {links.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => onNavClick(link.id)}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm transition-colors duration-150",
                  isActive
                    ? "font-medium text-ink"
                    : "text-muted hover:text-ink",
                )}
                aria-current={isActive ? "true" : undefined}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-200",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                  aria-hidden
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contact" onClick={() => onNavClick("contact")}>
              Contact
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-bg/98 backdrop-blur-md md:hidden">
          <nav
            className="container-narrow section-pad flex flex-col gap-0.5 py-3"
            aria-label="Mobile"
          >
            {links.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => onNavClick(link.id)}
                  className={cn(
                    "rounded-md px-3 py-3 text-base transition-colors",
                    isActive
                      ? "bg-teal-wash font-medium text-ink"
                      : "text-muted hover:bg-surface hover:text-ink",
                  )}
                >
                  {link.label}
                </a>
              );
            })}
            <Button asChild className="mt-3 w-full">
              <a href="#contact" onClick={() => onNavClick("contact")}>
                Contact
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
