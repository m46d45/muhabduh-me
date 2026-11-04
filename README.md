# muhabduh.id

Personal academic site for **Muhamad Abduh** (Professor of Civil Engineering, ITB).

Live: [https://muhabduh.id](https://muhabduh.id)

## Stack

TanStack Start (React 19 + Vite) · Tailwind CSS v4 · deployed on Vercel.

## Content map

| Path         | Source                                                                                  |
| ------------ | --------------------------------------------------------------------------------------- |
| Home News    | Current-year items from `src/data/works.ts` + optional activities in `src/data/news.ts` |
| Publications | Books in `src/data/publications.ts` + works archive in `src/data/works.ts`              |
| CV timeline  | `src/data/cv-timeline.ts`                                                               |
| Networks     | `src/data/networks.ts`                                                                  |
| Tools        | `src/components/portfolio/software.tsx`                                                 |
| Calendar     | Google Calendar embed + ICS (IDs in `calendar.tsx`)                                     |

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

## Private daily dashboard

`/dashboard` is a private page for Muhamad Abduh. It is not linked from the public site, sends `noindex`, and contains no personal data in the repository or the static bundle. Agenda, deadlines, projects, and decisions are loaded only from authenticated `/api` functions.

The public pages do not require any of the environment variables below. If they are missing, `/dashboard` shows a clear error after login and the rest of the site stays up.

### Endpoints

| Method | Path             | Auth                                                                                                                                                       |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/api/login`     | JSON `{ "password": "..." }`. Sets an httpOnly `dashboard_session` cookie (Secure on HTTPS, 7 days).                                                       |
| `POST` | `/api/logout`    | Clears the cookie.                                                                                                                                         |
| `GET`  | `/api/dashboard` | Session cookie. Snapshot plus open rows from the Keputusan tab.                                                                                            |
| `POST` | `/api/keputusan` | Session cookie. JSON `{ "id", "keputusan", "komentar" }`. Writes only when the Keputusan cell is still empty, then appends a completion note to Waktu WIB. |
| `POST` | `/api/snapshot`  | `Authorization: Bearer $SNAPSHOT_TOKEN` (or `X-Snapshot-Token`). Replaces the private daily snapshot.                                                      |

All of these responses use `Cache-Control: private, no-store`.

Failed logins wait longer after each miss (starting at 0.8s) and return HTTP 429 for 15 minutes after 8 misses from the same address. The counter lives in the function instance, so it slows an attacker down; it is not a global lock across every isolate.

### Snapshot JSON

Push this once a day, around 04.30 WIB, after the morning routine. The server stores it in a **private** Vercel Blob (`dashboard/snapshot.json`). Unknown fields are dropped. Strings that mention `INPEX`, `Masela`, `OLNG`, or the token `IDR` are replaced **before** the blob is written, and again before they are served:

- agenda and lookahead become `Rapat klien (rahasia)` with the clock time only
- a deadline becomes `Tenggat klien (rahasia)` with its date only
- a project becomes `Proyek klien (rahasia)` with its category only

```json
{
  "generatedAt": "2026-11-04T04:30:00+07:00",
  "agenda": [
    {
      "judul": "Kuliah CIM",
      "mulai": "10.00",
      "selesai": "12.00",
      "lokasi": "Lab",
      "catatan": "opsional",
      "tautan": "https://example.com/kuliah"
    }
  ],
  "tenggat": [
    {
      "judul": "Kirim draf bab",
      "jatuhTempo": "2026-11-06",
      "proyek": "Bank soal",
      "tautan": "https://example.com/draf"
    }
  ],
  "lookahead": [
    {
      "tanggal": "2026-11-05",
      "judul": "Bimbingan",
      "mulai": "09.00",
      "selesai": "10.00",
      "lokasi": "Ruang dosen"
    }
  ],
  "proyek": [
    {
      "nama": "Bank soal",
      "kategori": "Aktif",
      "tautan": "https://example.com/proyek",
      "catatan": "opsional, satu kalimat"
    }
  ]
}
```

`generatedAt` is an ISO-8601 timestamp. `mulai` / `selesai` use `HH.MM` or `HH:MM`. Dates use `YYYY-MM-DD`. `kategori` should be one of `Aktif`, `Melambat`, `Tertahan`, `Dorman`. `agenda` is today's list. `tenggat` should already be this week; items with a parseable date outside Monday–Sunday WIB are not counted. `lookahead` is clipped to today through the next 13 days WIB.

A successful push returns `{ "ok": true, "receivedAt": "<ISO>", "redacted": 0 }`. `redacted` is a count, not the removed text. There is one snapshot; the next push replaces it. The page warns when `receivedAt` is older than 26 hours.

### Keputusan tab

Open rows are read from the live sheet (about a minute of cache), not from the snapshot. A row is open when the Keputusan cell is empty **and** Waktu WIB does not contain a completion note (`diputuskan`, `selesai`, `ditutup`, `via dashboard`, `completed`, or `decided`).

Column positions are not hard-coded. The header row is matched by name:

| Field                            | Accepted headers                                                                                                                                                                                                                              |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                               | `ID`, `Kode`, `Kode keputusan`                                                                                                                                                                                                                |
| Keputusan                        | header containing `Keputusan` or `Decision`                                                                                                                                                                                                   |
| Waktu WIB                        | `Waktu WIB` or `Waktu`                                                                                                                                                                                                                        |
| Catatan                          | `Tanggapan saya`, `Tanggapan`, `Catatan`, `Komentar`, `Comment`, `Notes`                                                                                                                                                                      |
| Pertanyaan                       | `Judul`, `Pertanyaan`, `Question`, `Uraian`, `Deskripsi`, `Isu`, `Topik`, `Hal`, `Q`                                                                                                                                                          |
| Muncul                           | `Muncul` (tanggal item muncul; ditampilkan di kartu)                                                                                                                                                                                          |
| Opsi                             | Taken from `Judul`, not a sheet column. The clause after the last `;` or `:` (or a question shaped `A, B, atau C?`) is split on commas and `atau`. Fewer than two choices becomes `Setuju`, `Tolak`, `Tunda`. The page adds `Keputusan lain`. |
| Proyek / Sumber / Lewat / Tautan | `Proyek`, `Sumber`, `Lewat`, `Tautan`                                                                                                                                                                                                         |

The page lists the headers it actually used. A write fills Keputusan only while that cell is still empty, appends `diputuskan via dashboard, DD MMM HH.MM WIB` to Waktu WIB, and appends the comment to Tanggapan saya. If Keputusan is already filled, the API returns 409 and does not overwrite it.

### Environment variables

Set these on the Vercel project. Do not commit the values.

| Variable                  | Purpose                                                              |
| ------------------------- | -------------------------------------------------------------------- |
| `DASHBOARD_PASSWORD_HASH` | scrypt hash from `scripts/hash-dashboard-password.mjs`               |
| `AUTH_SECRET`             | Random string, at least 16 characters, used to sign the cookie       |
| `SNAPSHOT_TOKEN`          | Random bearer token for the 04.30 bot, at least 16 characters        |
| `BLOB_READ_WRITE_TOKEN`   | Vercel Blob read/write token; objects are stored with private access |
| `GOOGLE_SA_EMAIL`         | Google service account email                                         |
| `GOOGLE_SA_PRIVATE_KEY`   | PEM private key from the service account JSON                        |
| `SHEET_ID`                | Spreadsheet id of the existing Pelacak sheet                         |
| `SHEET_TAB`               | Optional. Defaults to `Keputusan`                                    |

Create the password hash without putting the password in shell history:

```bash
node scripts/hash-dashboard-password.mjs <<'EOF'
kata sandi di sini
EOF
```

`AUTH_SECRET` and `SNAPSHOT_TOKEN` can each be `openssl rand -base64 32`.

### Akun layanan Google (sekali)

1. Di Google Cloud Console, buat service account dan unduh kunci JSON. Aktifkan Google Sheets API.
2. `client_email` menjadi `GOOGLE_SA_EMAIL`. `private_key` menjadi `GOOGLE_SA_PRIVATE_KEY` (biarkan `\n` di dalamnya).
3. Buka Sheet Pelacak → Bagikan → undang email service account sebagai **Editor**. Cukup file itu.
4. `SHEET_ID` adalah id di URL spreadsheet. `SHEET_TAB` diisi `Keputusan` bila tab-nya bernama demikian.
5. Simpan semua nilai di Vercel, bukan di repo.

## Notes

- Auth / Postgres helpers under `src/lib` come from the app template; this site does not require sign-in.
- Visitor and link counters use Abacus (`src/lib/counter.ts`).
- Portrait: `public/portrait.jpg` (source photo may live under `attachments/`).
- QR: prefer `public/qr-muhabduh.svg` (PNG regenerated from SVG).
