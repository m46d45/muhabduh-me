/** Core courses shown on the Teaching page. */
export const coreCourses = [
  { id: "lean-construction", title: "Lean Construction", level: "UG/S2" },
  {
    id: "design-analysis-construction-operations",
    title: "Design and Analysis of Construction Operations",
    level: "UG/S2",
  },
  {
    id: "construction-operations-management",
    title: "Construction Operations Management",
    level: "S2",
  },
  {
    id: "sustainable-construction",
    title: "Sustainable Construction",
    level: "UG/S2",
  },
  {
    id: "construction-cost-estimating",
    title: "Construction Cost Estimating",
    level: "UG",
  },
  {
    id: "project-production-management",
    title: "Project Production Management",
    level: "S2",
  },
  {
    id: "construction-supply-chains",
    title: "Construction Supply Chains",
    level: "S2",
  },
  { id: "engineering-economy", title: "Engineering Economy", level: "UG" },
];

export const iceIntro = [
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

export const iceSeries = [
  {
    id: "ice-seri-01",
    title: "Parade Tim Kerja",
    native: "Simulasi Konstruksi Ramping Seri 01",
    description:
      "Parade-of-trades zone-flow for learning variability, WIP, and batch handoff.",
    href: "https://icecenter.itb.ac.id/courses/simulasi-konstruksi-ramping-seri-01-parade-tim-kerja/",
    trackId: "teaching-ice-seri-01",
    note: "Series 01 · 2 hours",
  },
  {
    id: "ice-seri-02",
    title: "SiklOps",
    native: "Simulasi Konstruksi Ramping Seri 02",
    description:
      "Discrete-event simulation of cyclic construction operations, simple → complex.",
    href: "https://icecenter.itb.ac.id/courses/simulasi-konstruksi-ramping-seri-02-siklus-operasi/",
    trackId: "teaching-ice-seri-02",
    note: "Series 02 · 2 hours",
  },
  {
    id: "ice-seri-03",
    title: "Neo-CYCLONE",
    native: "Simulasi Konstruksi Ramping Seri 03",
    description:
      "AI-assisted CYCLONE modeling and simulation for construction operations (Halpin).",
    href: "https://icecenter.itb.ac.id/courses/simulasi-konstruksi-ramping-seri-03-neo-cyclone/",
    trackId: "teaching-ice-seri-03",
    note: "Series 03 · 2 hours",
  },
  {
    id: "ice-seri-04",
    title: "SiapKerja!",
    native: "Simulasi Konstruksi Ramping Seri 04",
    description:
      "Last Planner System teaching simulation for a type-36 house: master plan through daily huddle.",
    href: "https://icecenter.itb.ac.id/courses/simulasi-konstruksi-ramping-seri-04-siapkerja/",
    trackId: "teaching-ice-seri-04",
    note: "Series 04 · 2 hours",
  },
  {
    id: "ice-seri-05",
    title: "Rusun Takt",
    native: "Simulasi Konstruksi Ramping Seri 05",
    description:
      "Lean takt simulation for a three-storey rusun: push vs JIT, zones, and waiting waste.",
    href: "https://icecenter.itb.ac.id/courses/simulasi-konstruksi-ramping-seri-05-rusun-takt/",
    trackId: "teaching-ice-seri-05",
    note: "Series 05 · 2 hours",
  },
  {
    id: "ice-seri-06",
    title: "MP2K",
    native: "Simulasi Konstruksi Ramping Seri 06",
    description:
      "Multi-party project production planning game for lean collaboration and flow.",
    href: "https://icecenter.itb.ac.id/courses/simulasi-konstruksi-ramping-seri-06-mp2k/",
    trackId: "teaching-ice-seri-06",
    note: "Series 06 · 2 hours",
  },
];

/** Flat catalog used by blog cross-links. */
export const courses = [
  ...coreCourses.map((course) => ({
    id: course.id,
    title: course.title,
    href: `/teaching#${course.id}`,
  })),
  ...iceIntro.map((course) => ({
    id: course.id,
    title: course.title,
    href: course.href,
  })),
  ...iceSeries.map((course) => ({
    id: course.id,
    title: course.title,
    href: course.href,
  })),
];
