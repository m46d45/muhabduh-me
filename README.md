# muhabduh.id

Personal academic site for **Muhamad Abduh** (Professor of Civil Engineering, ITB).

Live: [https://muhabduh.id](https://muhabduh.id)

## Stack

TanStack Start (React 19 + Vite) · Tailwind CSS v4 · deployed on Vercel.

## Content map

| Path | Source |
| --- | --- |
| Home News | Current-year items from `src/data/works.ts` + optional activities in `src/data/news.ts` |
| Publications | Books in `src/data/publications.ts` + works archive in `src/data/works.ts` |
| CV timeline | `src/data/cv-timeline.ts` |
| Networks | `src/data/networks.ts` |
| Tools | `src/components/portfolio/software.tsx` |
| Calendar | Google Calendar embed + ICS (IDs in `calendar.tsx`) |

## How to update News / works

1. Add or edit entries in **`src/data/works.ts`** (prefer DOI links; do not invent DOIs).
2. Optional activities (workshops you attended): add to **`newsActivities`** in `src/data/news.ts`.
3. Home News and the year spotlight are derived automatically from current-year works.
4. Optional check against public ORCID:

```bash
node scripts/orcid-check.mjs
```

Review the printed gaps, then paste curated rows into `works.ts`.

## Local development

```bash
npm install
npm run dev      # http://0.0.0.0:8080
npm run typecheck
npm run build
```

## Notes

- Auth / Postgres helpers under `src/lib` come from the app template; this site does not require sign-in.
- Visitor and link counters use Abacus (`src/lib/counter.ts`).
- Portrait: `public/portrait.jpg` (source photo may live under `attachments/`).
- QR: prefer `public/qr-muhabduh.svg` (PNG regenerated from SVG).
