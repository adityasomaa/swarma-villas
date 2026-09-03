/** IDR with thin separators, e.g. "IDR 850,000". */
export function formatIDR(amount: number): string {
  return `IDR ${amount.toLocaleString("en-US")}`;
}

export function pluralise(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Parse `YYYY-MM-DD` in LOCAL time. `new Date(iso)` parses as UTC and can
 *  land on the previous day for anyone east of Greenwich — including Bali. */
export function parseISODate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [, y, mo, d] = m.map(Number) as unknown as [string, number, number, number];
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return date;
}

export function formatDateLong(iso: string): string {
  const d = parseISODate(iso);
  if (!d) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  if (!d) return iso;
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Whole nights between two ISO dates. 0 if the pair is missing or backwards. */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseISODate(checkIn);
  const b = parseISODate(checkOut);
  if (!a || !b) return 0;
  const ms = b.getTime() - a.getTime();
  return ms > 0 ? Math.round(ms / 86400000) : 0;
}
