import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Faculty-style primary nav. Scroll-spy: last section whose document top is
 * at or above the spy line under the sticky header.
 *
 * Desktop shows a compact set; full list is always on mobile + in page sections.
 */
const links = [
  { href: "#bio", label: "About", id: "bio" },
  { href: "#news", label: "News", id: "news" },
  { href: "#experience", label: "Experience", id: "experience" },
  { href: "#research", label: "Research", id: "research" },
  { href: "#teaching", label: "Teaching", id: "teaching" },
  { href: "#networks", label: "Networks", id: "networks" },
  { href: "#projects", label: "Projects", id: "projects" },
  { href: "#software", label: "Software", id: "software" },
  { href: "#articles", label: "Publications", id: "articles" },
] as const;

const SECTION_ORDER = [
  "bio",
  "news",
  "experience",
  "research",
  "teaching",
  "networks",
  "projects",
  "software",
  "articles",
  "contact",
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    function resolveActive(): string {
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

      const docHeight = document.documentElement.scrollHeight;
      const viewBottom = window.scrollY + window.innerHeight;
      if (viewBottom >= docHeight - 8) {
        current = SECTION_ORDER[SECTION_ORDER.length - 1];
      }

      return current;
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
      <div className="container-narrow section-pad flex h-16 items-center justify-between gap-4 lg:gap-6">
        <a
          href="#top"
          className="group min-w-0 max-w-[11rem] shrink leading-tight sm:max-w-[14rem]"
          onClick={() => {
            setActive("");
            closeMenu();
          }}
          title="Don't be afraid to care."
        >
          <span className="block truncate font-display text-[0.95rem] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-base">
            Muhamad Abduh
          </span>
          <span className="mt-0.5 block truncate font-display text-[0.7rem] font-medium italic tracking-tight text-subtle sm:text-xs">
            Don't be afraid to care...
          </span>
        </a>

        <nav
          className="hidden items-center gap-0 2xl:flex"
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
                  "relative rounded-md px-2 py-2 text-[0.8125rem] transition-colors duration-150",
                  isActive
                    ? "font-medium text-ink"
                    : "text-muted hover:text-ink",
                )}
                aria-current={isActive ? "true" : undefined}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-2 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-200",
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
            className="2xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-bg/98 backdrop-blur-md 2xl:hidden">
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
