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

| Method | Path             | Auth                                                                                                                                                         |
| ------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST` | `/api/login`     | JSON `{ "password": "..." }`. Sets an httpOnly `dashboard_session` cookie (Secure on HTTPS, 12 hours) and records that session id in the private Blob store. |
| `POST` | `/api/logout`    | Clears the cookie and deletes that session id, so a copied cookie is rejected.                                                                               |
| `GET`  | `/api/dashboard` | Session cookie. Snapshot plus open rows from the Keputusan tab.                                                                                              |
| `POST` | `/api/keputusan` | Session cookie. JSON `{ "id", "keputusan", "komentar" }`. Writes only when the Keputusan cell is still empty, then appends a completion note to Waktu WIB.   |
| `POST` | `/api/snapshot`  | `Authorization: Bearer $SNAPSHOT_TOKEN` (or `X-Snapshot-Token`). Replaces the private daily snapshot.                                                        |

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

`generatedAt` is an ISO-8601 timestamp. `mulai` / `selesai` use `HH.MM` or `HH:MM`. Both `00.00` means the event lasts all day; the page shows `Seharian` instead of `00.00–00.00`. Dates use `YYYY-MM-DD`. `kategori` should be one of `Aktif`, `Melambat`, `Tertahan`, `Dorman`. `agenda` is today's list. `tenggat` should already be this week; items with a parseable date outside Monday–Sunday WIB are not counted. `lookahead` is clipped to today through the next 13 days WIB.

A successful push returns `{ "ok": true, "receivedAt": "<ISO>", "redacted": 0 }`. `redacted` is a count, not the removed text. There is one snapshot; the next push replaces it. The page warns when `receivedAt` is older than 26 hours.

### Keputusan tab

Open rows are read from the live sheet (about a minute of cache), not from the snapshot. A row is open only when both Keputusan and Waktu WIB are empty. Any text in Waktu WIB, including a note such as `sudah dibalas Abduh…`, closes the row.

Column positions are not hard-coded. The header row is matched by name:

| Field                            | Accepted headers                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                               | `ID`, `Kode`, `Kode keputusan`                                                                                                                                                                                                                                                                                                                                                                 |
| Keputusan                        | header containing `Keputusan` or `Decision`                                                                                                                                                                                                                                                                                                                                                    |
| Waktu WIB                        | `Waktu WIB` or `Waktu`                                                                                                                                                                                                                                                                                                                                                                         |
| Catatan                          | `Tanggapan saya`, `Tanggapan`, `Catatan`, `Komentar`, `Comment`, `Notes`                                                                                                                                                                                                                                                                                                                       |
| Pertanyaan                       | `Judul`, `Pertanyaan`, `Question`, `Uraian`, `Deskripsi`, `Isu`, `Topik`, `Hal`, `Q`                                                                                                                                                                                                                                                                                                           |
| Muncul                           | `Muncul` (tanggal item muncul; ditampilkan di kartu)                                                                                                                                                                                                                                                                                                                                           |
| Opsi                             | The same five choices on every card: `Setuju, kerjakan`, `Tolak, jangan dikerjakan`, `Tunda, tanyakan lagi minggu depan`, `Sudah saya tangani sendiri`, `Abaikan / tidak relevan`, plus `Keputusan lain` with a text field. The old per-row menu inside `Judul` is not shown. The card title is the `Judul` stem, with a `?` added when it is missing, and a trailing `;` option list removed. |
| Proyek / Sumber / Lewat / Tautan | `Proyek`, `Sumber`, `Lewat`, `Tautan`                                                                                                                                                                                                                                                                                                                                                          |

The page lists the headers it actually used. A write fills Keputusan only while that cell and Waktu WIB are still empty, then writes `diputuskan via dashboard, DD MMM HH.MM WIB` into Waktu WIB and appends the comment to Tanggapan saya. If either cell is already filled, the API returns 409 and does not overwrite it.

`Tunda, tanyakan lagi minggu depan` is the exception. It still writes Keputusan (that exact phrase), Tanggapan saya (the comment, if any), and Waktu WIB, but Waktu WIB is `tunda sampai YYYY-MM-DD · dicatat via dashboard, DD MMM HH.MM WIB`. The date is seven days after today in WIB. Until that date the card is hidden. On that date and after, the card is listed again even though the cells are filled, and the next save may replace them. Any other text in Waktu WIB still closes the row.

### Urutan kepentingan

Menunggu Bapak is sorted `Mendesak`, then `Penting`, then `Bisa nanti`. Each card shows that label and a due date.

The due date is the earliest concrete date in Judul (`2026-11-25`, `25/11/2026`, or `8 Des` / `8 Desember 2026`). A missing year is this year or next year, whichever resulting date is closer to today WIB. If Judul says `hari ini` and has no date, the due date is Muncul, or today when Muncul cannot be parsed. If Judul still has no date, the earliest snapshot deadline for the same project name is used. Otherwise the card says there is no due date.

- **Mendesak** — due today or earlier. With no due date: the Lewat column, the word `lewat` in Judul, or Muncul at least 7 days ago.
- **Penting** — due in 1 to 7 days. With no due date: Muncul 3 to 6 days ago.
- **Bisa nanti** — due later than 7 days, or Muncul within the last 2 days, or no date at all.

Inside one band, the earlier due date comes first, then the older Muncul date, then the ID.

### Status proyek

The Status column on ResearchGate, Personal Website, LC Bibliometric, RagilE, Seri ICE, Rencana Paper, and Kuliah MBK is task progress (`Sudah`, `Belum`, and similar). It is not the project heartbeat.

Project status is the tab **`Status Proyek`**, columns **`Proyek`**, **`Status`**, **`Diubah WIB`**. The select is only `Aktif`, `Tertahan`, `Dorman`, or `Selesai`, and it shows the cell in that tab. The morning category (`Melambat` and the rest) is not shown on the page.

Above the lists, the page shows counts that match those lists: open decisions (cards that are not still deferred), how many of those are Mendesak, today's agenda, clashes, this week's deadlines, and projects whose saved status is Tertahan or Dorman.

Text from the snapshot and from Judul is cleaned before it is shown. Agent notes stay in the sheet: decision ids such as `K-20261105-07`, `Kopi Pagi`, `diputuskan via dashboard`, `BELUM TERVERIFIKASI`, `PR #…`, `Denyut`, and file names such as `ringkasan_usulan.md`. The page keeps the question, the due date, the importance label, the agenda title, time, and place, and the project name with its status.

Names fold into one canonical row. A variant that starts with a seeded name (`ResearchGate full-text`) or contains every word of a multi-word seed (`Seri Simulasi ICE` → `Seri ICE`) uses that seed's spelling. The page then adds a blank row for every other project it shows, and renames an alias cell to the canonical spelling. Existing Status and Diubah WIB cells are left as they are. An empty Status means it has not been set. Heartbeat routines should read this tab, not the task Status columns.

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
