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
- Portrait on the page: `public/portrait-640.avif`, `portrait-640.webp`, and `portrait-640.jpg` (640 px wide, the size the home page displays). `public/portrait.jpg` is the original and is not used on the page.
- Fonts are self-hosted subsets in `public/fonts/` (Source Sans 3 and Source Serif 4). No Google Fonts request.
- QR: prefer `public/qr-muhabduh.svg` (PNG regenerated from SVG).
- Save contact: `/muhamad-abduh.vcf`, served as `text/vcard` so a phone can open it.
- Functions run in Vercel region `sin1` (`vercel.json`). Public pages do not query Neon. If a database is attached later, it should live in AWS `ap-southeast-1` (Singapore) so it sits next to `sin1`.
- Canonical host is `https://muhabduh.id`. `www` redirects to the apex in `vercel.json`. The domain redirect in the Vercel dashboard still has to match: Settings → Domains → edit `muhabduh.id` and clear any redirect to `www`; edit `www.muhabduh.id` and set Redirect to `muhabduh.id`.

## Blog

Drafts live in `content/blog/*.md` with `status: draft`. A production build (`VERCEL_ENV=production`) leaves them out of lists, RSS, sitemap, and prerender. A Vercel preview build (`VERCEL_ENV=preview`) shows them for review, with a draf label and `noindex`. Publishing one post means changing that file to `status: published` after Abduh says so. Do not rewrite the wording in the file.

`contoh-gaya-abduh-ig.md` is a style note only. It is not a post.

### Ilustrasi tulisan

Optional. Set `image: /blog/<slug>.webp` in the post front matter.

- Square, with the subject in the center, so the same file can sit beside the title, on the card, and in an IG or FB post without a crop.
- Line art, two or three colors from the site palette (`#1f6f8b`, `#14202b`, `#f4f1ea`). No photo, no text inside the image, no recognizable face.
- WebP, 800×800 px, under 80 KB. Put the file in `public/blog/`.
- Leave `image` out when there is no illustration. The title and the card stay as text, with no empty box.
- The picture is made only after Abduh approves its one-sentence description (blueprint, section "Ilustrasi tulisan").
