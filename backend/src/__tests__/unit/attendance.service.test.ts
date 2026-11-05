import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaClient } from "../../../generated/prisma";

import prisma from "../../config/database";
import { AttendanceService } from "../../services/attendance.service";
import { buildQrPayload, currentWindow } from "../../utils/attendanceToken";

jest.mock("../../config/database", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as DeepMockProxy<PrismaClient>;

const SECRET = "session-secret";
const EMAIL = "student@ipi.ba";
const SUBJECT = { id: 5, name: "Matematika 2" };

const openSession = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 1,
    lectureId: 10,
    professorId: 3,
    token: SECRET,
    status: "ACTIVE",
    openAt: new Date(),
    expiresAt: new Date(Date.now() + 60_000),
    closeAt: null,
    lecture: { id: 10, room: "RC2", type: "EXERCISE", subject: SUBJECT },
    ...overrides,
  }) as any;

const validPayload = () => buildQrPayload(SECRET, 1, currentWindow());

const mockStudent = (subjectIds: number[]) => {
  prismaMock.student.findUnique.mockResolvedValueOnce({
    id: 99,
    majorId: 1,
    currentYear: 1,
  } as any);
  prismaMock.yearPlan.findMany.mockResolvedValueOnce([
    { subjects: subjectIds.map((id) => ({ id })) },
  ] as any);
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("AttendanceService.scan", () => {
  it("records attendance and returns the subject summary", async () => {
    prismaMock.attendanceSession.findUnique.mockResolvedValueOnce(openSession());
    mockStudent([SUBJECT.id]);
    const scannedAt = new Date();
    prismaMock.attendance.create.mockResolvedValueOnce({ scannedAt } as any);
    prismaMock.attendance.count.mockResolvedValueOnce(3);
    prismaMock.attendanceSession.count.mockResolvedValueOnce(4);
    // One weekly exercise slot, Mondays Oct–Dec 2026 → 13 planned classes.
    prismaMock.lecture.findMany.mockResolvedValueOnce([
      {
        dayOfWeek: 0,
        startDate: new Date("2026-10-01T00:00:00Z"),
        endDate: new Date("2026-12-31T00:00:00Z"),
      },
    ] as any);

    const result = await AttendanceService.scan(EMAIL, validPayload());

    expect(result).toMatchObject({
      subject: SUBJECT,
      type: "EXERCISE",
      attended: 3,
      held: 4,
      planned: 13,
      alreadyRecorded: false,
    });
    // Counts are scoped to the scanned slot's type (vježbe), not all of the subject.
    expect(prismaMock.attendance.count).toHaveBeenCalledWith({
      where: { studentId: 99, session: { lecture: { subjectId: SUBJECT.id, type: "EXERCISE" } } },
    });
    expect(prismaMock.attendance.create).toHaveBeenCalledWith({
      data: { sessionId: 1, studentId: 99 },
    });
  });

  it("treats a second scan as success (unique constraint P2002)", async () => {
    prismaMock.attendanceSession.findUnique.mockResolvedValueOnce(openSession());
    mockStudent([SUBJECT.id]);
    prismaMock.attendance.create.mockRejectedValueOnce({ code: "P2002" });
    prismaMock.attendance.findUnique.mockResolvedValueOnce({ scannedAt: new Date() } as any);
    prismaMock.attendance.count.mockResolvedValueOnce(3);
    prismaMock.attendanceSession.count.mockResolvedValueOnce(4);
    prismaMock.lecture.findMany.mockResolvedValueOnce([
      { dayOfWeek: 0, startDate: null, endDate: null },
    ] as any);

    const result = await AttendanceService.scan(EMAIL, validPayload());
    expect(result.alreadyRecorded).toBe(true);
    expect(result.planned).toBeNull(); // no period set → app falls back to "held"
  });

  it("rejects a payload that is not an attendance QR", async () => {
    await expect(AttendanceService.scan(EMAIL, "https://example.com")).rejects.toMatchObject({
      code: "INVALID_QR",
      status: 400,
    });
  });

  it("rejects a closed or expired session before checking the signature", async () => {
    prismaMock.attendanceSession.findUnique.mockResolvedValueOnce(
      openSession({ expiresAt: new Date(Date.now() - 1) }),
    );
    await expect(AttendanceService.scan(EMAIL, validPayload())).rejects.toMatchObject({
      code: "SESSION_CLOSED",
    });
  });

  it("rejects an old QR code", async () => {
    prismaMock.attendanceSession.findUnique.mockResolvedValueOnce(openSession());
    const stale = buildQrPayload(SECRET, 1, currentWindow() - 5);
    await expect(AttendanceService.scan(EMAIL, stale)).rejects.toMatchObject({
      code: "QR_EXPIRED",
    });
  });

  it("rejects a student who does not take the subject", async () => {
    prismaMock.attendanceSession.findUnique.mockResolvedValueOnce(openSession());
    mockStudent([SUBJECT.id + 1]);
    await expect(AttendanceService.scan(EMAIL, validPayload())).rejects.toMatchObject({
      code: "NOT_ENROLLED",
      status: 403,
    });
    expect(prismaMock.attendance.create).not.toHaveBeenCalled();
  });
});
