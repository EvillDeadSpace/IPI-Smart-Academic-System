/**
 * Calendar math for weekly lecture slots.
 * dayOfWeek: 0 = Monday … 6 = Sunday (same convention as Lecture.dayOfWeek).
 * Dates are compared as calendar days in UTC — admin picks plain dates (YYYY-MM-DD),
 * which are stored at UTC midnight, so no timezone can shift a day.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

const utcDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

/** How many times a weekly slot on `dayOfWeek` happens between start and end (inclusive). */
export function countWeeklyOccurrences(dayOfWeek: number, start: Date, end: Date): number {
  const s = utcDay(start);
  const e = utcDay(end);
  if (e < s) return 0;

  const startDow = (new Date(s).getUTCDay() + 6) % 7; // JS Sunday=0 → Monday=0
  const first = s + ((dayOfWeek - startDow + 7) % 7) * DAY_MS;
  if (first > e) return 0;

  return Math.floor((e - first) / (7 * DAY_MS)) + 1;
}

type Period = { dayOfWeek: number; startDate: Date | null; endDate: Date | null };

/** Total classes in the period, or null when the admin hasn't set a period yet. */
export const plannedClasses = (l: Period): number | null =>
  l.startDate && l.endDate ? countWeeklyOccurrences(l.dayOfWeek, l.startDate, l.endDate) : null;

/** Is `day` inside the slot's period? A slot without a period is always active (legacy data). */
export const isActiveOn = (l: Omit<Period, "dayOfWeek">, day: Date): boolean => {
  const d = utcDay(day);
  return (!l.startDate || utcDay(l.startDate) <= d) && (!l.endDate || utcDay(l.endDate) >= d);
};

/** Parses a plain "YYYY-MM-DD" date to UTC midnight; null for anything else. */
export function parsePlainDate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

/** Today's calendar date in Sarajevo, as UTC midnight (matches how periods are stored). */
export function todayInSarajevo(now: Date = new Date()): Date {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Sarajevo" }).format(now);
  return new Date(`${ymd}T00:00:00.000Z`);
}
