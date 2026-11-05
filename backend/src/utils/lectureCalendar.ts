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

// ─── Room clashes ─────────────────────────────────────────────

/** Mon–Fri; the faculty schedules no weekend classes. */
export const WORKING_DAYS = [0, 1, 2, 3, 4];

/** "HH:MM" strings compare correctly as text. Touching ends (09:30 / 09:30) don't clash. */
export const timesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
  aStart < bEnd && bStart < aEnd;

type DateBound = Date | null;

/** Periods overlap unless one ends before the other starts; a missing bound is open-ended. */
export const periodsOverlap = (
  a: { startDate: DateBound; endDate: DateBound },
  b: { startDate: DateBound; endDate: DateBound },
) =>
  !(a.endDate && b.startDate && utcDay(a.endDate) < utcDay(b.startDate)) &&
  !(b.endDate && a.startDate && utcDay(b.endDate) < utcDay(a.startDate));

export type ScheduleSlot = {
  id?: number;
  room: string;
  dayOfWeek: number;
  startTime: string;
  endOfTime: string;
  startDate: DateBound;
  endDate: DateBound;
};

export const normalizeRoom = (room: string) => room.trim().toUpperCase();

/**
 * First existing slot that occupies the same room at an overlapping time on the same weekday,
 * during an overlapping period. `candidate.id` is skipped so a slot never clashes with itself.
 */
export function findRoomConflict<T extends ScheduleSlot>(candidate: ScheduleSlot, existing: T[]) {
  return existing.find(
    (other) =>
      other.id !== candidate.id &&
      normalizeRoom(other.room) === normalizeRoom(candidate.room) &&
      other.dayOfWeek === candidate.dayOfWeek &&
      timesOverlap(candidate.startTime, candidate.endOfTime, other.startTime, other.endOfTime) &&
      periodsOverlap(candidate, other),
  );
}
