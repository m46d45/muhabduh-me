import { GraduationCap, Users, Mic2 } from "lucide-react";

/** Official course names as taught at ITB (kept in Indonesian). */
const itbCourses = [
  "Desain dan Analisis Operasi Konstruksi",
  "Ekonomi Teknik",
  "Estimasi Biaya Konstruksi",
  "Komputasi dalam Teknik Sipil",
  "Konstruksi Berkelanjutan",
  "Konstruksi Ramping (Lean Construction)",
  "Manajemen Bisnis Konstruksi",
  "Manajemen Infrastruktur",
  "Manajemen Konstruksi",
  "Manajemen Operasi Infrastruktur",
  "Manajemen Operasi Konstruksi",
  "Manajemen Produksi Proyek",
  "Manajemen Proyek",
  "Manajemen Proyek Transportasi",
  "Metode Pelaksanaan Konstruksi",
  "Metode Penelitian",
  "Pengantar Rekayasa Infrastruktur",
  "Produktivitas Konstruksi",
  "Rantai Pasok Konstruksi",
  "Rekayasa dan Desain Infrastruktur",
  "Sistem Informasi Manajemen Infrastruktur",
  "Sistem Perencanaan dan Pengendalian Proyek",
  "Sistem Rekayasa Sipil",
  "Studi Mandiri Teknik Sipil",
  "TI dalam Konstruksi",
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
      "National seminars on lean construction and related policy themes",
      "Participation in conferences such as ConCERN and GOBUILD",
      "Sharing notes on more sustainable and productive construction",
    ],
  },
];

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
            Courses I have taught at Institut Teknologi Bandung, and the wider
            construction community I keep learning with — students,
            practitioners, and institutions.
          </p>
        </div>

        <div className="mt-12">
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-subtle">
            Courses at ITB
          </h3>
          <p className="mt-2 text-sm text-muted">
            Faculty of Civil and Environmental Engineering · official titles
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {itbCourses.map((course) => (
              <li key={course}>
                <span className="inline-flex rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-ink">
                  {course}
                </span>
              </li>
            ))}
          </ul>
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
      </div>
    </section>
  );
}
