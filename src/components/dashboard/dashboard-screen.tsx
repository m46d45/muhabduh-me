import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DECISION_CHOICES, OTHER_DECISION } from "@/lib/dashboard/decisions";
import { PROJECT_STATUSES, STATUS_TAB, type StatusView } from "@/lib/dashboard/projects";
import type {
  AgendaItem,
  DashboardPayload,
  DecisionView,
  TenggatItem,
} from "@/lib/dashboard/types";

type Failure = { ok: false; error: string };

function formatToday(date = new Date()): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatUpdated(iso: string | null): string {
  if (!iso) return "Belum ada pembaruan";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Belum ada pembaruan";
  const text = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${text} WIB`;
}

function formatDay(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00+07:00`);
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function formatDue(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00+07:00`);
  if (Number.isNaN(date.getTime())) return dateKey;
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function clock(item: { mulai: string | null; selesai: string | null }): string {
  if (item.mulai && item.selesai) return `${item.mulai}–${item.selesai}`;
  return item.mulai ?? item.selesai ?? "Waktu belum ada";
}

function safeHref(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function readJson(response: Response): Promise<DashboardPayload | Failure> {
  const data = (await response.json()) as DashboardPayload | Failure;
  if (!response.ok || !data.ok) {
    return { ok: false, error: "error" in data ? data.error : "Permintaan gagal." };
  }
  return data;
}

export function DashboardScreen() {
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const response = await fetch("/api/dashboard", { headers: { accept: "application/json" } });
    if (response.status === 401) {
      setPayload(null);
      return;
    }
    const data = await readJson(response);
    if (!data.ok) {
      setLoginError(data.error);
      setPayload(null);
      return;
    }
    setLoginError(null);
    setPayload(data);
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const response = await fetch("/api/dashboard", { headers: { accept: "application/json" } });
      if (cancelled) return;
      if (response.status === 401) return;
      const data = await readJson(response);
      if (cancelled || !data.ok) {
        if (!cancelled && !data.ok) setLoginError(data.error);
        return;
      }
      setPayload(data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setLoginError(null);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setLoginError(data.error ?? "Kata sandi salah.");
        return;
      }
      setPassword("");
      await load();
    } catch {
      setLoginError("Tidak terhubung. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onLogout() {
    await fetch("/api/logout", { method: "POST" });
    setPayload(null);
  }

  return (
    <main className="min-h-svh">
      <div className="container-narrow section-pad py-8 sm:py-12">
        {payload ? (
          <DashboardView payload={payload} onLogout={() => void onLogout()} onChanged={load} />
        ) : (
          <LoginPanel
            password={password}
            error={loginError}
            submitting={submitting}
            onPassword={setPassword}
            onSubmit={onLogin}
          />
        )}
      </div>
    </main>
  );
}

function LoginPanel({
  password,
  error,
  submitting,
  onPassword,
  onSubmit,
}: {
  password: string;
  error: string | null;
  submitting: boolean;
  onPassword: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center">
      <p className="text-sm font-medium text-accent">muhabduh.id</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Dasbor harian</h1>
      <p className="mt-3 text-muted">
        Halaman pribadi. Agenda dan keputusan tidak dimuat sebelum masuk.
      </p>
      <form
        onSubmit={onSubmit}
        className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-soft"
      >
        <Label htmlFor="dashboard-password">Kata sandi</Label>
        <Input
          id="dashboard-password"
          className="mt-2"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => onPassword(event.target.value)}
          required
        />
        {error ? (
          <p role="alert" className="mt-3 text-sm font-medium text-ink">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="mt-5 w-full" disabled={submitting}>
          {submitting ? "Memeriksa…" : "Masuk"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-subtle">
        <Link to="/" className="text-accent underline-offset-4 hover:underline">
          Kembali ke situs publik
        </Link>
      </p>
    </div>
  );
}

function DashboardView({
  payload,
  onLogout,
  onChanged,
}: {
  payload: DashboardPayload;
  onLogout: () => void;
  onChanged: () => Promise<void>;
}) {
  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Pribadi · tidak diindeks</p>
          <h1 className="mt-1 font-display text-4xl text-ink">Dasbor harian</h1>
          <p className="mt-2 capitalize text-muted">{formatToday()}</p>
          <p className="text-sm text-subtle">Diperbarui {formatUpdated(payload.generatedAt)}</p>
        </div>
        <Button type="button" variant="secondary" onClick={onLogout}>
          <LogOut className="h-4 w-4" aria-hidden />
          Keluar
        </Button>
      </header>

      {payload.warnings.length > 0 ? (
        <div className="mt-6 space-y-2" role="status">
          {payload.warnings.map((warning) => (
            <p
              key={warning}
              className="rounded-lg border border-accent/30 bg-teal-wash/50 px-4 py-3 text-sm text-ink"
            >
              {warning}
            </p>
          ))}
        </div>
      ) : null}

      <DecisionSection
        items={payload.keputusan}
        sheetUrl={safeHref(payload.tautanSheet)}
        columns={payload.kolom}
        onChanged={onChanged}
      />
      <AgendaSection items={payload.agenda} clashes={payload.bentrok} />
      <HorizonSection tenggat={payload.tenggat} lookahead={payload.lookahead} />
      <ProjectSection items={payload.statusProyek} onChanged={onChanged} />
    </div>
  );
}

function SectionTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <p className="text-sm text-muted">{hint}</p>
    </div>
  );
}

function AgendaSection({
  items,
  clashes,
}: {
  items: AgendaItem[];
  clashes: { a: string; b: string }[];
}) {
  return (
    <section id="agenda-hari-ini" data-section="agenda-hari-ini" className="mt-8">
      <SectionTitle
        title="Agenda hari ini"
        hint="Judul singkat dan jam. Detail rahasia tidak ditampilkan."
      />
      {items.length === 0 ? (
        <Empty>Tidak ada agenda hari ini.</Empty>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {items.map((item, index) => (
            <li key={`${item.judul}-${item.mulai}-${index}`} className="flex gap-4 px-4 py-3">
              <p className="w-28 shrink-0 text-sm font-medium text-accent">{clock(item)}</p>
              <div className="min-w-0">
                <p className="text-ink">{item.judul}</p>
                {item.lokasi ? <p className="text-sm text-muted">{item.lokasi}</p> : null}
                {item.catatan ? <p className="text-sm text-muted">{item.catatan}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      {clashes.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-ink">
          {clashes.map((clash) => (
            <li key={`${clash.a}-${clash.b}`}>
              Bentrok: {clash.a} dan {clash.b}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function HorizonSection({
  tenggat,
  lookahead,
}: {
  tenggat: TenggatItem[];
  lookahead: AgendaItem[];
}) {
  return (
    <section id="tenggat-lookahead" data-section="tenggat-lookahead" className="mt-8">
      <SectionTitle
        title="Tenggat & look-ahead"
        hint="Tenggat minggu ini, lalu agenda 14 hari ke depan. Waktu WIB."
      />
      <h3 className="text-sm font-medium text-subtle">Tenggat minggu ini</h3>
      <div className="mt-2">
        <DeadlineList items={tenggat} />
      </div>
      <h3 className="mt-5 text-sm font-medium text-subtle">14 hari ke depan</h3>
      <div className="mt-2">
        <LookaheadList items={lookahead} />
      </div>
    </section>
  );
}

function DeadlineList({ items }: { items: TenggatItem[] }) {
  if (items.length === 0) return <Empty>Tidak ada tenggat minggu ini.</Empty>;
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
      {items.map((item, index) => (
        <li key={`${item.judul}-${item.jatuhTempo}-${index}`} className="px-4 py-3">
          <p className="text-ink">{item.judul}</p>
          <p className="text-sm text-muted">
            {item.jatuhTempo ? formatDue(item.jatuhTempo) : "Tanggal menyusul"}
            {item.proyek ? ` · ${item.proyek}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}

function LookaheadList({ items }: { items: AgendaItem[] }) {
  const groups = new Map<string, AgendaItem[]>();
  for (const item of items) {
    const key = item.tanggal ?? "tanpa-tanggal";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  if (items.length === 0) return <Empty>Tidak ada agenda dalam 14 hari ke depan.</Empty>;
  return (
    <div className="space-y-5">
      {[...groups.entries()].map(([key, group]) => (
        <div key={key}>
          <h3 className="text-sm font-medium text-subtle">
            {key === "tanpa-tanggal" ? "Tanggal belum jelas" : formatDay(key)}
          </h3>
          <ul className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {group.map((item, index) => (
              <li key={`${key}-${item.judul}-${index}`} className="flex gap-4 px-4 py-3">
                <p className="w-28 shrink-0 text-sm font-medium text-accent">{clock(item)}</p>
                <p className="text-ink">{item.judul}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ProjectSection({
  items,
  onChanged,
}: {
  items: StatusView[];
  onChanged: () => Promise<void>;
}) {
  return (
    <section id="status-proyek" data-section="status-proyek" className="mt-8 pb-10">
      <SectionTitle
        title="Status proyek"
        hint={`Nilai yang tersimpan di tab ${STATUS_TAB}. Pilih Aktif, Tertahan, Dorman, atau Selesai.`}
      />
      {items.length === 0 ? (
        <Empty>Belum ada proyek untuk diubah statusnya.</Empty>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {items.map((item) => (
            <ProjectRow key={item.nama} item={item} onChanged={onChanged} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ProjectRow({ item, onChanged }: { item: StatusView; onChanged: () => Promise<void> }) {
  const [status, setStatus] = useState(item.status ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const href = safeHref(item.tautan);
  const selectId = `status-${item.nama.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  useEffect(() => {
    setStatus(item.status ?? "");
  }, [item.status]);

  async function onPick(next: string) {
    if (!next || next === item.status) return;
    setStatus(next);
    setPending(true);
    setSaved(false);
    setError(null);
    try {
      const response = await fetch("/api/status-proyek", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ proyek: item.nama, status: next }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setStatus(item.status ?? "");
        setError(data.error ?? "Status tidak tersimpan.");
        return;
      }
      setSaved(true);
      await onChanged();
    } catch {
      setStatus(item.status ?? "");
      setError("Tidak terhubung. Coba lagi.");
    } finally {
      setPending(false);
    }
  }

  const current = item.status ?? item.statusMentah ?? "Belum diisi";

  return (
    <li className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-ink">{item.nama}</p>
        <p className="text-sm text-muted">
          Saat ini: {current}
          {item.diubah ? ` · diubah ${item.diubah}` : ""}
          {item.snapshot && item.snapshot !== item.status
            ? ` · snapshot pagi ${item.snapshot}`
            : ""}
        </p>
        {error ? (
          <p role="alert" className="text-sm font-medium text-ink">
            {error}
          </p>
        ) : null}
        {saved && !error ? <p className="text-sm text-accent">Tersimpan</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <label className="sr-only" htmlFor={selectId}>
          Status {item.nama}
        </label>
        <select
          id={selectId}
          className="h-11 min-w-40 cursor-pointer rounded-md border border-border bg-surface px-3 text-sm text-fg"
          value={status}
          disabled={pending}
          onChange={(event) => void onPick(event.target.value)}
        >
          <option value="" disabled>
            Belum diisi
          </option>
          {PROJECT_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent"
            aria-label={`Buka ${item.nama}`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </li>
  );
}

function DecisionSection({
  items,
  sheetUrl,
  columns,
  onChanged,
}: {
  items: DecisionView[];
  sheetUrl: string | null;
  columns: DashboardPayload["kolom"];
  onChanged: () => Promise<void>;
}) {
  return (
    <section id="menunggu-bapak" data-section="menunggu-bapak" className="mt-8">
      <SectionTitle
        title="Menunggu Bapak"
        hint="Diurutkan Mendesak, Penting, lalu Bisa nanti. Tiap kartu menampilkan label dan tenggat."
      />
      <details className="mb-4 text-sm text-muted">
        <summary className="cursor-pointer text-accent">Aturan urutan</summary>
        <p className="mt-2">
          Tenggat diambil dari tanggal di judul. Kalau tahunnya tidak ditulis, dipakai tahun ini
          atau tahun depan, mana yang lebih dekat ke hari ini. Kalau tidak ada tanggal, dipakai
          tenggat snapshot pada proyek yang sama. Kalau judul menulis &quot;hari ini&quot;,
          tenggatnya tanggal Muncul. Mendesak: tenggat hari ini atau sudah lewat, atau belum ada
          tenggat dan item sudah muncul 7 hari atau lebih. Penting: tenggat 1–7 hari lagi, atau
          muncul 3–6 hari tanpa tenggat. Selain itu: Bisa nanti.
        </p>
      </details>
      {items.length === 0 ? (
        <Empty>Tidak ada keputusan yang menunggu.</Empty>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <DecisionCard
              key={`${item.id || "rahasia"}-${index}`}
              item={item}
              sheetUrl={sheetUrl}
              onChanged={onChanged}
            />
          ))}
        </div>
      )}
      {columns ? (
        <details className="mt-4 text-sm text-muted">
          <summary className="cursor-pointer text-accent">Kolom Sheet yang dikenali</summary>
          <p className="mt-2">
            ID: {columns.id ?? "—"} · Muncul: {columns.muncul ?? "—"} · Keputusan:{" "}
            {columns.keputusan ?? "—"} · Waktu: {columns.waktu ?? "—"} · Tanggapan:{" "}
            {columns.catatan ?? "—"} · Judul: {columns.pertanyaan ?? "—"} · Opsi:{" "}
            {columns.opsi ?? "—"}
          </p>
        </details>
      ) : null}
    </section>
  );
}

function DecisionCard({
  item,
  sheetUrl,
  onChanged,
}: {
  item: DecisionView;
  sheetUrl: string | null;
  onChanged: () => Promise<void>;
}) {
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const fieldId = `keputusan-${item.id || item.pertanyaan}`;
  const other = OTHER_DECISION;
  const choices = DECISION_CHOICES;
  const keputusan = selected === other ? custom.trim() : selected;
  const canSave = selected !== "" && keputusan !== "";

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/keputusan", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ id: item.id, keputusan, komentar: comment }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Keputusan tidak tersimpan.");
        return;
      }
      setSelected("");
      setCustom("");
      setComment("");
      await onChanged();
    } catch {
      setError("Tidak terhubung. Coba lagi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <article className="rounded-lg border border-border bg-surface p-4 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <ImportanceBadge level={item.penting} />
        <p className="text-sm text-muted">
          {item.tenggat ? `Tenggat ${formatDue(item.tenggat)}` : "Belum ada tenggat"}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-xl text-ink">{item.pertanyaan}</h3>
          {item.munculLagi ? (
            <p className="mt-1 text-sm text-accent">Muncul lagi setelah ditunda.</p>
          ) : null}
          <p className="mt-1 text-sm text-muted">
            {[
              item.muncul ? `Muncul ${item.muncul}` : "",
              item.proyek,
              item.sumber,
              item.lewat ? "Lewat waktu" : "",
            ]
              .filter(Boolean)
              .join(" · ") || "Tanpa proyek"}
          </p>
        </div>
        {item.rahasia && sheetUrl ? (
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent underline-offset-4 hover:underline"
          >
            Buka di Sheet
          </a>
        ) : null}
      </div>
      {item.terkunci ? (
        <p className="mt-3 text-sm text-muted">
          Detail ada di Sheet. Baris ini tidak bisa diisi dari halaman, supaya ID-nya tidak ikut
          terkirim.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <fieldset>
            <legend className="text-sm font-medium text-ink">Keputusan</legend>
            <div className="mt-2 space-y-2">
              {[...choices, other].map((option) => (
                <label
                  key={option}
                  className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-2 text-sm text-ink"
                >
                  <input
                    type="radio"
                    className="mt-1 h-4 w-4 accent-accent"
                    name={fieldId}
                    value={option}
                    checked={selected === option}
                    onChange={() => setSelected(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {selected === other ? (
            <div>
              <Label htmlFor={`${fieldId}-lain`}>Keputusan lain</Label>
              <Input
                id={`${fieldId}-lain`}
                className="mt-2"
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                placeholder="Tulis keputusan"
                required
              />
            </div>
          ) : null}
          <div>
            <Label htmlFor={`${fieldId}-catatan`}>Komentar</Label>
            <Textarea
              id={`${fieldId}-catatan`}
              className="mt-2 min-h-24"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Opsional, masuk ke kolom Tanggapan saya"
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm font-medium text-ink">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending || !canSave}>
            {pending ? "Menyimpan…" : "Simpan"}
          </Button>
        </form>
      )}
    </article>
  );
}

function ImportanceBadge({ level }: { level: DecisionView["penting"] }) {
  const className =
    level === "Mendesak"
      ? "bg-ink text-accent-fg"
      : level === "Penting"
        ? "bg-teal-wash text-ink"
        : "bg-bg-deep text-muted";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {level}
    </span>
  );
}

function Empty({ children }: { children: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted">
      {children}
    </p>
  );
}
