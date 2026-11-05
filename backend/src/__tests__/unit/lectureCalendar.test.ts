import {
  ScheduleSlot,
  countWeeklyOccurrences,
  findRoomConflict,
  isActiveOn,
  parsePlainDate,
  plannedClasses,
  todayInSarajevo,
} from "../../utils/lectureCalendar";

const d = (ymd: string) => parsePlainDate(ymd)!;
const MON = 0;
const WED = 2;
const SUN = 6;

describe("countWeeklyOccurrences", () => {
  // 2026-10-05 is a Monday.
  it("counts both ends when the period starts and ends on the slot's day", () => {
    expect(countWeeklyOccurrences(MON, d("2026-10-05"), d("2026-10-26"))).toBe(4);
  });

  it("counts a ~3 month semester slot (Oct–Dec, Mondays)", () => {
    expect(countWeeklyOccurrences(MON, d("2026-10-01"), d("2026-12-31"))).toBe(13);
  });

  it("starts from the first matching weekday after the start date", () => {
    // Thu 2026-10-01 → first Wednesday is 10-07.
    expect(countWeeklyOccurrences(WED, d("2026-10-01"), d("2026-10-07"))).toBe(1);
    expect(countWeeklyOccurrences(WED, d("2026-10-01"), d("2026-10-06"))).toBe(0);
  });

  it("handles Sunday (dayOfWeek 6) and a single-day period", () => {
    expect(countWeeklyOccurrences(SUN, d("2026-10-04"), d("2026-10-04"))).toBe(1);
    expect(countWeeklyOccurrences(MON, d("2026-10-04"), d("2026-10-04"))).toBe(0);
  });

  it("returns 0 when end is before start", () => {
    expect(countWeeklyOccurrences(MON, d("2026-12-01"), d("2026-10-01"))).toBe(0);
  });
});

describe("plannedClasses / isActiveOn", () => {
  const slot = { dayOfWeek: MON, startDate: d("2026-10-01"), endDate: d("2026-12-31") };

  it("is null when no period is set", () => {
    expect(plannedClasses({ dayOfWeek: MON, startDate: null, endDate: null })).toBeNull();
    expect(plannedClasses(slot)).toBe(13);
  });

  it("is active only inside the period (inclusive); legacy slots are always active", () => {
    expect(isActiveOn(slot, d("2026-10-01"))).toBe(true);
    expect(isActiveOn(slot, d("2026-12-31"))).toBe(true);
    expect(isActiveOn(slot, d("2026-09-30"))).toBe(false);
    expect(isActiveOn(slot, d("2027-01-01"))).toBe(false);
    expect(isActiveOn({ startDate: null, endDate: null }, d("2030-01-01"))).toBe(true);
  });
});

describe("parsePlainDate / todayInSarajevo", () => {
  it("accepts only real YYYY-MM-DD dates", () => {
    expect(parsePlainDate("2026-02-29")).toBeNull();
    expect(parsePlainDate("2026-13-01")).toBeNull();
    expect(parsePlainDate("01.10.2026")).toBeNull();
    expect(parsePlainDate({})).toBeNull();
    expect(parsePlainDate("2028-02-29")?.toISOString()).toBe("2028-02-29T00:00:00.000Z");
  });

  it("uses the Sarajevo calendar day, not UTC", () => {
    // 23:30 UTC on Oct 4 is already Oct 5 in Sarajevo (UTC+2 in summer time).
    expect(todayInSarajevo(new Date("2026-10-04T23:30:00Z")).toISOString()).toBe(
      "2026-10-05T00:00:00.000Z",
    );
  });
});

describe("findRoomConflict", () => {
  const winter = { startDate: d("2026-10-01"), endDate: d("2027-01-31") };
  const summer = { startDate: d("2027-02-15"), endDate: d("2027-06-15") };
  const existing: ScheduleSlot[] = [
    { id: 1, room: "RC2", dayOfWeek: MON, startTime: "08:00", endOfTime: "09:30", ...winter },
  ];
  const slot = (overrides: Partial<ScheduleSlot>): ScheduleSlot => ({
    room: "RC2",
    dayOfWeek: MON,
    startTime: "09:00",
    endOfTime: "10:30",
    ...winter,
    ...overrides,
  });

  it("catches a partial time overlap, not only an identical start time", () => {
    expect(findRoomConflict(slot({}), existing)?.id).toBe(1);
  });

  it("allows back-to-back slots (09:30 end / 09:30 start)", () => {
    expect(
      findRoomConflict(slot({ startTime: "09:30", endOfTime: "11:00" }), existing),
    ).toBeUndefined();
  });

  it("ignores room case and spaces", () => {
    expect(findRoomConflict(slot({ room: " rc2 " }), existing)?.id).toBe(1);
  });

  it("allows another room, another day, or a non-overlapping period", () => {
    expect(findRoomConflict(slot({ room: "RC3" }), existing)).toBeUndefined();
    expect(findRoomConflict(slot({ dayOfWeek: WED }), existing)).toBeUndefined();
    expect(findRoomConflict(slot(summer), existing)).toBeUndefined();
  });

  it("treats a slot without a period as always occupying the room", () => {
    expect(findRoomConflict(slot({ startDate: null, endDate: null }), existing)?.id).toBe(1);
  });

  it("never reports a slot as clashing with itself (editing)", () => {
    expect(findRoomConflict(slot({ id: 1 }), existing)).toBeUndefined();
  });
});
