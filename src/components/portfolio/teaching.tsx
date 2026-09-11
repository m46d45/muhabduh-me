import { ExternalLink, GraduationCap, Mic2, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TrackedLink } from "@/components/portfolio/link-stats";

/** Core courses shown on the main Teaching UI (~6–8). */
const coreCourses: { title: string; level: "UG" | "S2" | "UG/S2" }[] = [
  { title: "Lean Construction", level: "UG/S2" },
  { title: "Design and Analysis of Construction Operations", level: "UG/S2" },
  { title: "Construction Operations Management", level: "S2" },
  { title: "Sustainable Construction", level: "UG/S2" },
  { title: "Construction Cost Estimating", level: "UG" },
  { title: "Project Production Management", level: "S2" },
  { title: "Construction Supply Chains", level: "S2" },
  { title: "Engineering Economy", level: "UG" },
];

type IceCourse = {
  id: string;
  title: string;
  native: string;
  description: string;
  href: string;
  trackId: string;
  note: string;
};

const iceIntro: IceCourse[] = [
  {
    id: "ice-mok",
    title: "Introduction to Construction Operations Management",
    native: "Pengenalan Manajemen Operasi Konstruksi",
    description:
      "A short course on construction operations as the production layer after project management.",
    href: "https://icecenter.itb.ac.id/courses/pengenalan-manajemen-operasi-konstruksi/",
    trackId: "teaching-ice-mok",
    note: "3 hours",
  },
  {
    id: "ice-lean",
    title: "Introduction to Lean Construction",
    native: "Pengenalan Konstruksi Ramping",
    description:
      "A short course on lean construction as a way to look at delay, cost, and quality on site.",
    href: "https://icecenter.itb.ac.id/courses/pengenalan-konstruksi-ramping/",
    trackId: "teaching-ice-lean",
    note: "2 hours",
  },
  {
    id: "ice-sim",
    title: "Introduction to Construction Operations Simulation",
    native: "Pengenalan Simulasi Operasi Konstruksi",
    description:
      "A short course on simulating construction operations for design and field evaluation.",
    href: "https://icecenter.itb.ac.id/courses/pengenalan-simulasi-operasi-konstruksi/",
    trackId: "teaching-ice-sim",
    note: "2 hours",
  },
];

const teaching = [
  {
    icon: GraduationCap,
    title: "University teaching",
    items: [
      "Undergraduate and graduate courses at FTSL ITB",
      "Lean construction, operations, and project delivery",
      "Mentoring students in construction research",
    ],
  },
  {
    icon: Users,
    title: "Professional community",
    items: [
      "Service with IAMKRI (lean construction management society)",
      "Workshops and discussion with contractors and project teams",
      "Conversations between campus, industry, and public institutions",
    ],
  },
  {
    icon: Mic2,
    title: "Seminars & shared learning",
    items: [
      "SNKR 2026, the national lean construction seminar, with IAMKRI and AKI",
      "Participation in conferences such as ConCERN and GOBUILD",
      "Sharing notes on more sustainable and productive construction",
    ],
  },
];

function IceCourseGrid({ courses }: { courses: IceCourse[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <article
          key={course.id}
          className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6"
        >
          <span className="w-fit rounded-full border border-accent/25 bg-teal-wash px-2.5 py-0.5 text-xs font-medium text-accent">
            {course.note}
          </span>
          <h4 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
            {course.title}
          </h4>
          <p className="mt-1 text-xs text-subtle">{course.native}</p>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
            {course.description}
          </p>
          <div className="mt-5">
            <TrackedLink href={course.href} trackId={course.trackId}>
              <span className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90">
                Open
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </TrackedLink>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Teaching() {
  return (
    <section
      id="teaching"
      className="section-pad border-t border-border bg-bg-deep/40 py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Teaching
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Classrooms and shared learning
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Teaching at ITB and joining the wider construction community —
            students, practitioners, and institutions — to learn how we might
            build a little better.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {teaching.map((block) => {
            const Icon = block.icon;
            return (
              <article
                key={block.title}
                className="rounded-xl border border-border bg-surface p-6 shadow-soft sm:p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-teal-wash text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">
                  {block.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="border-t border-border pt-3 text-sm leading-relaxed text-muted first:border-t-0 first:pt-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mt-14">
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-subtle">
            Core courses at ITB
          </h3>
          <p className="mt-2 text-sm text-muted">
            Faculty of Civil and Environmental Engineering — selected
            undergraduate (UG) and graduate (S2) offerings.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {coreCourses.map((course) => (
              <li key={course.title}>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-ink">
                  {course.title}
                  <span className="rounded-full bg-teal-wash px-1.5 py-0.5 text-[0.65rem] font-medium text-accent">
                    {course.level}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-subtle">
                ICE Center
              </h3>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Short public courses with ITB Continuing Education — first
                looks at operations and lean construction. Browser simulation
                tools live under{" "}
                <Link
                  to="/tools"
                  className="font-medium text-accent underline-offset-2 hover:underline"
                >
                  Tools
                </Link>
                .
              </p>
            </div>
            <TrackedLink
              href="https://icecenter.itb.ac.id/profile/abduhitb-ac-id/"
              trackId="teaching-ice-profile"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              Instructor profile
              <ExternalLink className="h-3.5 w-3.5" />
            </TrackedLink>
          </div>

          <h4 className="mt-8 font-display text-base font-semibold tracking-tight text-ink">
            Introductions
          </h4>
          <IceCourseGrid courses={iceIntro} />

          <p className="mt-8 text-sm text-muted">
            Lean construction simulation series (Parade Tim Kerja, SiklOps,
            Neo-CYCLONE, SiapKerja!, Rusun Takt, MP2K) — open the live tools on{" "}
            <Link
              to="/tools"
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              Tools / Software
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
