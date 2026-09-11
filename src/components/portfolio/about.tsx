import { ExternalLink, FileUser, Images } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TrackedLink } from "@/components/portfolio/link-stats";

const ORCID = "https://orcid.org/0000-0001-6926-6665";

const profileResources = [
  {
    id: "cv",
    label: "Curriculum vitae",
    blurb: "On-site English CV — education, roles, awards, and links.",
    href: "/cv",
    icon: FileUser,
    internal: true,
  },
  {
    id: "media-photos",
    label: "Photos for media",
    blurb: "Photographs for invitations, media, and institutional use.",
    href: "https://itbdsti-my.sharepoint.com/:f:/g/personal/abduh_itb_ac_id/IgA-gX8rVSybToQJ1AGVwmGBAXhfgIrRto_M3Q9aknVxoDs?e=yKpbPt",
    icon: Images,
    internal: false,
  },
] as const;

export function About() {
  return (
    <section id="bio" className="section-pad border-t border-border py-24 sm:py-28">
      <div className="container-narrow">
        <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
              About
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Learning how construction can work better
            </h2>
            <div className="rule-accent mt-6" />
            <ul className="mt-8 space-y-4 text-sm text-muted">
              <li>
                <span className="text-subtle">Affiliation</span>
                <br />
                <TrackedLink
                  href="https://www.itb.ac.id"
                  trackId="about-itb"
                  className="mt-0.5 inline-flex items-center gap-1 font-medium text-ink hover:text-accent"
                >
                  Faculty of Civil & Environmental Engineering, ITB
                  <ExternalLink className="h-3 w-3" />
                </TrackedLink>
              </li>
              <li>
                <span className="text-subtle">Professional society</span>
                <br />
                <TrackedLink
                  href="https://iamkri.id"
                  trackId="about-iamkri"
                  className="mt-0.5 inline-flex items-center gap-1 font-medium text-ink hover:text-accent"
                >
                  IAMKRI (lean construction community)
                  <ExternalLink className="h-3 w-3" />
                </TrackedLink>
              </li>
              <li>
                <span className="text-subtle">Focus</span>
                <br />
                <span className="text-ink">
                  Lean · Sustainable · Supply chains · Operations · IT in
                  construction
                </span>
              </li>
              <li>
                <span className="text-subtle">Writing & research</span>
                <br />
                <TrackedLink
                  href="https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en"
                  trackId="about-scholar"
                  className="mt-0.5 inline-flex items-center gap-1 font-medium text-ink hover:text-accent"
                >
                  Google Scholar profile
                  <ExternalLink className="h-3 w-3" />
                </TrackedLink>
              </li>
              <li>
                <span className="text-subtle">ORCID</span>
                <br />
                <TrackedLink
                  href={ORCID}
                  trackId="about-orcid"
                  className="mt-0.5 inline-flex items-center gap-1 font-medium text-ink hover:text-accent"
                >
                  0000-0001-6926-6665
                  <ExternalLink className="h-3 w-3" />
                </TrackedLink>
              </li>
            </ul>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            <p>
              I work as a professor of civil engineering at{" "}
              <a
                href="https://www.itb.ac.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                Institut Teknologi Bandung (ITB)
              </a>
              . Much of my time is spent teaching, researching, writing, and
              talking with people in the industry about how projects and
              organizations can reduce waste — of material, time, and human
              effort.
            </p>
            <p>
              My research sits with lean and sustainable construction,
              operations, and related systems questions — in Indonesia and
              with colleagues abroad. Selected papers, a 2025–2027 topic
              note, and Scholar links are gathered under{" "}
              <Link
                to="/research"
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                Research
              </Link>
              . Any useful outcomes have always been shared work — with
              students, co-authors, and practitioners, including through{" "}
              <a
                href="https://iamkri.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                IAMKRI
              </a>
              .
            </p>
            <p className="text-sm text-subtle sm:text-base">
              Tentang singkat: Guru besar teknik sipil di ITB pada bidang
              manajemen operasi konstruksi — lean, keberlanjutan, dan rantai
              pasok — belajar bersama mahasiswa dan praktisi.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-subtle">
            Profile materials
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {profileResources.map((item) => {
              const Icon = item.icon;
              const body = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-teal-wash text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 font-display text-base font-semibold text-ink transition-colors group-hover:text-accent">
                      {item.label}
                      {!item.internal && (
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60" />
                      )}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {item.blurb}
                    </span>
                  </span>
                </>
              );
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-surface p-5 shadow-soft"
                >
                  {item.internal ? (
                    <Link
                      to="/cv"
                      className="group flex items-start gap-4"
                    >
                      {body}
                    </Link>
                  ) : (
                    <TrackedLink
                      href={item.href}
                      trackId={`about-${item.id}`}
                      className="group flex items-start gap-4"
                    >
                      {body}
                    </TrackedLink>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-subtle">
            Older CV drafts (Sway / Bitly) remain private archives — not the
            public door.
          </p>
        </div>
      </div>
    </section>
  );
}
