import { ExternalLink } from "lucide-react";
import { TrackedLink } from "@/components/portfolio/link-stats";

type SoftApp = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  tags: string[];
  note: string;
  appUrl: string;
  buttonLabel: string;
  trackId: string;
};

/**
 * All public teaching simulations (live on Vercel).
 * Always list every app; newest product work first.
 */
const apps: SoftApp[] = [
  {
    id: "neo-cyclone",
    title: "Neo-CYCLONE",
    subtitle: "AI-assisted CYCLONE modeling · Halpin tradition",
    description:
      "An AI-assisted classroom agent for Daniel W. Halpin’s CYCLONE language. Describe a construction operation in a structured prompt, draw the resource–task network, refine until the model is right, then simulate cycles with distributions, seed, and production units.",
    points: [
      "Prompt → draw CYCLONE model (resources, tasks, queues, production)",
      "Duration distributions: const, unif, tri, normal, lognormal, beta, gamma",
      "Run max cycles & seed; results after the diagram looks correct",
    ],
    tags: [
      "Vercel",
      "CYCLONE",
      "DES",
      "AI agent",
      "Teaching",
    ],
    note: "Full app · Vercel",
    appUrl: "https://neo-cyclone.vercel.app/",
    buttonLabel: "Open Neo-CYCLONE",
    trackId: "software-neo-cyclone-vercel",
  },
  {
    id: "mp2k",
    title: "MP2K",
    subtitle: "Multi-mode project production · PPM education",
    description:
      "MP2K (Multi-Moda Produksi Proyek Konstruksi) teaches Project Production Management with a fixed multi-mode concrete frame case: onsite craft columns, near-site beams, and far-supply floor panels that must match at the workface. Case → DES on capacity / variability / inventory → three-curve analytics.",
    points: [
      "Fixed case: RC frame, 3×5 grid, 2 floors, 8 zones per floor",
      "Three modes: M craft onsite · N near-site · F far supply & install",
      "DES with seed control, wave zoning, and Operations Science style curves",
    ],
    tags: [
      "Vercel",
      "PPM",
      "Multi-mode",
      "DES",
      "Inventory",
      "Teaching",
    ],
    note: "Full app · Vercel",
    appUrl: "https://mp2k.vercel.app/",
    buttonLabel: "Open MP2K",
    trackId: "software-mp2k-vercel",
  },
  {
    id: "siklops",
    title: "SiklOps",
    subtitle: "Cyclic construction operations · DES classroom path",
    description:
      "SiklOps (Siklus Operasi) is a discrete-event simulation for repeating construction operations — throughput, utilisation, queues, buffers, priority, cost, and CO₂e — not whole-project scheduling (WBS / CPM). A learning path runs simple → complex so DES ideas are introduced step by step.",
    points: [
      "Six operations: earthmoving · bricklaying · concreting · tower crane · asphalt paving · precast plant",
      "Shared workflow: choose op → set resources & cycle times → run → standard result tabs",
      "Scenarios, multi-seed where available, CSV export, and a full in-app manual",
    ],
    tags: [
      "Vercel",
      "DES",
      "Earthmoving",
      "Tower crane",
      "Asphalt",
      "Precast",
      "Teaching",
    ],
    note: "Full app · Vercel",
    appUrl: "https://siklops.vercel.app/",
    buttonLabel: "Open SiklOps",
    trackId: "software-siklops-vercel",
  },
  {
    id: "rusun-takt",
    title: "Rusun Takt",
    subtitle: "3-storey walk-up rusun · push, JIT & takt flow",
    description:
      "An educational lean construction simulation for a three-floor walk-up rusun (inspired by Takt Towers, adapted to Indonesia). Seven sequential crews move through five zones per floor while you explore push vs just-in-time starts, capacity variation, curing delays, waiting waste, owner duration, and labour margin.",
    points: [
      "7 wagons: structure → slab & stairs → walls → MEP → plaster → tiles → paint",
      "One zone–one team, 7-day slab curing, push (M1–M7) vs JIT mobilisation",
      "Weekly takt plan, capacity rolls, owner target, penalty and margin views",
    ],
    tags: [
      "Vercel",
      "Lean construction",
      "Takt plan",
      "Parade of trades",
      "Rusun",
      "Teaching",
    ],
    note: "Full app · Vercel",
    appUrl: "https://rusun-takt.vercel.app/",
    buttonLabel: "Open Rusun Takt",
    trackId: "software-rusun-takt-vercel",
  },
  {
    id: "parade-tim-kerja",
    title: "Parade Tim Kerja",
    subtitle: "Zone-flow parade · variability, WIP & batch handoff",
    description:
      "A classroom parade-of-trades tool for construction production learning (after Tommelein and colleagues). Observe how variability, sequential handoffs, and zoning affect duration, WIP, utilisation, and idle cost — free in the browser, no install. Landing on Vercel opens the interactive simulation.",
    points: [
      "Zone-flow with sequential trades (formwork → finishing style context)",
      "Capacity, variability, batch handoff; LOB / WIP / multi-scenario compare",
      "Takt plan aids (bay vs planning zone), seed control, CSV/Excel export",
    ],
    tags: [
      "Vercel",
      "Streamlit",
      "Lean construction",
      "Zone-flow",
      "WIP",
      "Teaching",
    ],
    note: "Landing · Vercel",
    appUrl: "https://parade-tim-kerja.vercel.app/",
    buttonLabel: "Open Parade Tim Kerja",
    trackId: "software-parade-tim-kerja-vercel",
  },
];

export function Software() {
  return (
    <section
      id="software"
      className="section-pad border-t border-border bg-bg-deep/40 py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Software
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Simulation tools
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            All of the teaching simulations currently online — open free in the
            browser. They keep evolving with classroom use; feedback is always
            welcome.
          </p>
          <p className="mt-2 text-sm text-subtle">
            {apps.length} tools · hosted on Vercel
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {apps.map((app, i) => (
            <article
              key={app.id}
              className="group flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200 hover:border-accent/30 sm:p-7"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="font-mono text-xs tabular-nums text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-accent/25 bg-teal-wash px-2.5 py-1 text-xs font-medium text-accent">
                  {app.note}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                {app.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">
                {app.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {app.description}
              </p>
              <ul className="mt-4 flex-1 space-y-2 border-t border-border pt-4">
                {app.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-snug text-muted"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70"
                      aria-hidden
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-bg-deep px-2.5 py-1 text-xs text-subtle"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <TrackedLink href={app.appUrl} trackId={app.trackId}>
                  <span className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90">
                    {app.buttonLabel}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
