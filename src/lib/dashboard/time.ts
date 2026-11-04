const WIB = "Asia/Jakarta";

export function wibParts(date: Date): {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  monthShort: string;
} {
  const numeric = new Intl.DateTimeFormat("en-GB", {
    timeZone: WIB,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const month = new Intl.DateTimeFormat("en-GB", {
    timeZone: WIB,
    month: "short",
  }).format(date);
  const pick = (type: string) => numeric.find((part) => part.type === type)?.value ?? "";
  return {
    year: pick("year"),
    month: pick("month"),
    day: pick("day"),
    hour: pick("hour"),
    minute: pick("minute"),
    monthShort: month.replace(".", ""),
  };
}

/** YYYY-MM-DD in Asia/Jakarta. */
export function wibDateKey(date: Date): string {
  const parts = wibParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function addDays(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() + days);
  const y = utc.getUTCFullYear();
  const m = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const d = String(utc.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Monday–Sunday window containing `today`, as YYYY-MM-DD keys in WIB. */
export function wibWeekRange(today: string): { start: string; end: string } {
  const [year, month, day] = today.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  const weekday = utc.getUTCDay();
  const fromMonday = weekday === 0 ? -6 : 1 - weekday;
  return { start: addDays(today, fromMonday), end: addDays(today, fromMonday + 6) };
}

export function parseDateKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const text = value.trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const dmy = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (dmy) {
    const day = dmy[1].padStart(2, "0");
    const month = dmy[2].padStart(2, "0");
    return `${dmy[3]}-${month}-${day}`;
  }
  return null;
}

/** Minutes from midnight, or null when the text is not a clock time. */
export function parseClock(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d{1,2})[.:](\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
}

export function formatClock(value: string | null | undefined): string | null {
  const minutes = parseClock(value);
  if (minutes == null || !value) return null;
  const match = value.trim().match(/^(\d{1,2})[.:](\d{2})$/);
  if (!match) return null;
  return `${match[1].padStart(2, "0")}.${match[2]}`;
}

/** Calendar all-day items arrive as midnight to midnight. */
export function isAllDay(
  mulai: string | null | undefined,
  selesai: string | null | undefined,
): boolean {
  return parseClock(mulai) === 0 && parseClock(selesai) === 0;
}

export function formatEventSpan(item: { mulai: string | null; selesai: string | null }): string {
  if (isAllDay(item.mulai, item.selesai)) return "Seharian";
  if (item.mulai && item.selesai) return `${item.mulai}–${item.selesai}`;
  return item.mulai ?? item.selesai ?? "Waktu belum ada";
}

export function completionNote(now: Date): string {
  const parts = wibParts(now);
  return `diputuskan via dashboard, ${parts.day} ${parts.monthShort} ${parts.hour}.${parts.minute} WIB`;
}

export function withCompletion(existing: string, now: Date): string {
  const note = completionNote(now);
  const base = existing.trim();
  if (!base) return note;
  return `${base} · ${note}`;
}

export type TimedItem = { judul: string; mulai: string | null; selesai: string | null };

export function findClashes<T extends TimedItem>(items: T[]): { a: T; b: T }[] {
  const parsed = items.flatMap((item) => {
    const start = parseClock(item.mulai);
    const end = parseClock(item.selesai);
    if (start == null || end == null || end <= start) return [];
    return [{ item, start, end }];
  });
  const clashes: { a: T; b: T }[] = [];
  for (let i = 0; i < parsed.length; i++) {
    for (let j = i + 1; j < parsed.length; j++) {
      const left = parsed[i];
      const right = parsed[j];
      if (!left || !right) continue;
      if (left.start < right.end && right.start < left.end) {
        clashes.push({ a: left.item, b: right.item });
      }
    }
  }
  return clashes;
}

export function isWithinWeek(dateKey: string | null, today: string): boolean {
  if (!dateKey) return true;
  const week = wibWeekRange(today);
  return dateKey >= week.start && dateKey <= week.end;
}

export function isWithinLookahead(dateKey: string | null, today: string): boolean {
  if (!dateKey) return true;
  const end = addDays(today, 13);
  return dateKey >= today && dateKey <= end;
}
