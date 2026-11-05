// Mirrors backend/src/utils/lectureCalendar.ts — used for the live "N termina" preview.
const DAY_MS = 24 * 60 * 60 * 1000

/** Weekly slot on dayOfWeek (0 = Monday) between two YYYY-MM-DD dates, inclusive. */
export function countWeeklyOccurrences(
    dayOfWeek: number,
    startDate: string,
    endDate: string
): number {
    const s = Date.parse(`${startDate}T00:00:00Z`)
    const e = Date.parse(`${endDate}T00:00:00Z`)
    if (Number.isNaN(s) || Number.isNaN(e) || e < s) return 0
    const startDow = (new Date(s).getUTCDay() + 6) % 7
    const first = s + ((dayOfWeek - startDow + 7) % 7) * DAY_MS
    return first > e ? 0 : Math.floor((e - first) / (7 * DAY_MS)) + 1
}

/** "2026-10-01T00:00:00.000Z" → "2026-10-01" (for <input type="date">). */
export const toInputDate = (iso?: string | null) => (iso ? iso.slice(0, 10) : '')

/** "2026-10-01T00:00:00.000Z" → "1.10.2026." */
export const formatPlainDate = (iso?: string | null) => {
    if (!iso) return ''
    const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
    return `${d}.${m}.${y}.`
}

/** Mon–Fri — must match WORKING_DAYS on the backend. */
export const WORKING_DAYS = [0, 1, 2, 3, 4]

type Slot = {
    id?: number
    room: string
    dayOfWeek: number
    startTime: string
    endTime: string
    startDate?: string | null // YYYY-MM-DD or ISO
    endDate?: string | null
}

const day = (v?: string | null) => (v ? v.slice(0, 10) : null)

/**
 * Same rules as backend findRoomConflict: same room (case/space-insensitive), same weekday,
 * overlapping times (touching ends are fine) and overlapping periods. Used for the live warning;
 * the backend still enforces it.
 */
export function findRoomConflict<T extends Slot>(candidate: Slot, existing: T[]): T | undefined {
    const room = candidate.room.trim().toUpperCase()
    const cs = day(candidate.startDate)
    const ce = day(candidate.endDate)
    return existing.find((o) => {
        const os = day(o.startDate)
        const oe = day(o.endDate)
        return (
            o.id !== candidate.id &&
            o.room.trim().toUpperCase() === room &&
            o.dayOfWeek === candidate.dayOfWeek &&
            candidate.startTime < o.endTime &&
            o.startTime < candidate.endTime &&
            !(ce && os && ce < os) &&
            !(oe && cs && oe < cs)
        )
    })
}
