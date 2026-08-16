import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = {
  period: string;
  title: string;
  org: string;
  description: string;
  current?: boolean;
  orgUrl?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoScale?: string;
};

const roles: Role[] = [
  {
    period: "Present",
    title: "Professor of Civil Engineering",
    org: "Faculty of Civil & Environmental Engineering, ITB",
    orgUrl: "https://www.itb.ac.id",
    logoSrc: "/orgs/itb-logo.png",
    logoAlt: "Institut Teknologi Bandung logo",
    logoScale: "scale-125",
    description:
      "I teach and supervise research in construction management and lean construction, and try to stay useful to students, colleagues, and partners in industry and government.",
    current: true,
  },
  {
    period: "Present",
    title: "Chairman",
    org: "IAMKRI — Indonesian Lean Construction Professional Society",
    orgUrl: "https://iamkri.id",
    logoSrc: "/orgs/iamkri-logo.png",
    logoAlt: "IAMKRI logo",
    description:
      "I help convene a national community of lean construction practice — learning with members, sharing experience, and supporting capacity building where I can.",
    current: true,
  },
  {
    period: "Career path",
    title: "Faculty member, construction engineering",
    org: "Institut Teknologi Bandung",
    orgUrl: "https://www.itb.ac.id",
    logoSrc: "/orgs/itb-logo.png",
    logoAlt: "Institut Teknologi Bandung logo",
    logoScale: "scale-125",
    description:
      "I have grown through faculty ranks at ITB with a steady interest in lean readiness, green construction assessment, supply chains, and operations in Indonesian practice.",
  },
  {
    period: "Ongoing",
    title: "Researcher & knowledge partner",
    org: "Industry · Government · International networks",
    description:
      "I join applied research, conferences, and knowledge products that link local construction questions with global lean and sustainability conversations (including IGLC and related forums).",
  },
];

const affiliations = [
  {
    name: "Institut Teknologi Bandung",
    short: "itb.ac.id",
    href: "https://www.itb.ac.id",
    logoSrc: "/orgs/itb-logo.png",
    logoScale: "scale-125",
    blurb: "Where I teach and do research",
  },
  {
    name: "IAMKRI",
    short: "iamkri.id",
    href: "https://iamkri.id",
    logoSrc: "/orgs/iamkri-logo.png",
    blurb: "Lean construction professional community",
  },
];

const reviewOutlets = [
  "Automation in Construction",
  "International Journal of Construction Management",
  "ASCE Journal of Infrastructure Systems",
  "Journal of Asian Architecture and Building Engineering",
  "Journal of Construction in Developing Countries",
  "International Journal of Disaster Resilience in the Built Environment",
  "International Journal of Built Environment and Sustainability",
  "Frontiers in Sustainability",
  "Journal of Engineering, Design and Technology",
  "International Group for Lean Construction",
  "Jurnal Teknik Sipil, FTSL ITB",
  "Civil Engineering Dimension, Petra University",
];

export function Experience() {
  return (
    <section
      id="experience"
      className="section-pad border-t border-border bg-bg-deep/40 py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Experience
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Roles and responsibilities
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Appointments at{" "}
            <a
              href="https://www.itb.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              ITB
            </a>
            , service with{" "}
            <a
              href="https://iamkri.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              IAMKRI
            </a>
            , review work for journals and conferences, and collaboration with
            practice.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {affiliations.map((org) => (
            <a
              key={org.href}
              href={org.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-5 shadow-soft transition-colors duration-150 hover:border-accent/35"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-bg p-2">
                <img
                  src={org.logoSrc}
                  alt={`${org.name} logo`}
                  className={cn(
                    "max-h-full max-w-full object-contain",
                    org.logoScale,
                  )}
                  loading="lazy"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 font-display text-base font-semibold text-ink transition-colors group-hover:text-accent">
                  {org.name}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60" />
                </span>
                <span className="mt-0.5 block text-xs font-medium uppercase tracking-wider text-subtle">
                  {org.short}
                </span>
                <span className="mt-1 block text-sm text-muted">{org.blurb}</span>
              </span>
            </a>
          ))}
        </div>

        <ol className="mt-12 space-y-0">
          {roles.map((role) => (
            <li
              key={role.title + role.period}
              className="relative grid gap-3 border-t border-border py-8 sm:grid-cols-[9.5rem_1fr] sm:gap-10 lg:grid-cols-[11rem_1fr]"
            >
              <div className="pt-0.5">
                <time className="font-mono text-xs tabular-nums text-subtle sm:text-sm">
                  {role.period}
                </time>
              </div>
              <div>
                <div className="flex flex-wrap items-start gap-3">
                  {role.logoSrc && (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-surface p-1.5">
                      <img
                        src={role.logoSrc}
                        alt={role.logoAlt ?? ""}
                        className={cn(
                          "max-h-full max-w-full object-contain",
                          role.logoScale,
                        )}
                        loading="lazy"
                      />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                      {role.title}
                    </h3>
                    {role.orgUrl ? (
                      <a
                        href={role.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-sm text-accent underline-offset-2 hover:underline"
                      >
                        {role.org}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="mt-1 block text-sm text-subtle">
                        {role.org}
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                  {role.description}
                </p>
                {role.current && (
                  <span className="mt-4 inline-flex rounded-full border border-accent/25 bg-teal-wash px-2.5 py-1 text-xs font-medium text-accent">
                    Current
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 border-t border-border pt-12">
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-subtle">
            Reviewer
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Journals and conferences I review for, when asked. A small part of
            keeping the conversation in the field careful and useful.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {reviewOutlets.map((name) => (
              <li key={name}>
                <span className="inline-flex rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-ink">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
