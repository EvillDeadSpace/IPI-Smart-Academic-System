import prisma from "../config/database";
import { formatLecture } from "../utils/helperFunction";
import {
  WINDOW_MS,
  generateSessionSecret,
  parseQrPayload,
  verifyQr,
} from "../utils/attendanceToken";

// ponytail: fixed 2h scan window per session; make it configurable when a professor asks.
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

export type AttendanceErrorCode =
  | "INVALID_QR"
  | "SESSION_CLOSED"
  | "QR_EXPIRED"
  | "NOT_ENROLLED"
  | "STUDENT_NOT_FOUND"
  | "PROFESSOR_NOT_FOUND"
  | "LECTURE_NOT_FOUND"
  | "FORBIDDEN"
  | "SESSION_NOT_FOUND";

const STATUS_BY_CODE: Record<AttendanceErrorCode, number> = {
  INVALID_QR: 400,
  SESSION_CLOSED: 410,
  QR_EXPIRED: 410,
  NOT_ENROLLED: 403,
  STUDENT_NOT_FOUND: 404,
  PROFESSOR_NOT_FOUND: 404,
  LECTURE_NOT_FOUND: 404,
  FORBIDDEN: 403,
  SESSION_NOT_FOUND: 404,
};

export class AttendanceError extends Error {
  readonly status: number;
  readonly code: AttendanceErrorCode;
  constructor(code: AttendanceErrorCode, message: string) {
    super(message);
    this.code = code;
    this.status = STATUS_BY_CODE[code];
  }
}

const isOpen = (s: { status: string; expiresAt: Date }, now = new Date()) =>
  s.status === "ACTIVE" && s.expiresAt > now;

// Same subject derivation as LectureService (major + current year plan), so the student
// can scan exactly the lectures they see in their schedule.
async function getStudentWithSubjectIds(email: string) {
  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) throw new AttendanceError("STUDENT_NOT_FOUND", "Student not found");

  const yearPlans = await prisma.yearPlan.findMany({
    where: { majorId: student.majorId, year: student.currentYear },
    include: { subjects: { select: { id: true } } },
  });
  const subjectIds = yearPlans.flatMap((p) => p.subjects.map((s) => s.id));
  return { student, subjectIds };
}

async function getOwnedLecture(professorEmail: string, lectureId: number) {
  const professor = await prisma.professor.findUnique({ where: { email: professorEmail } });
  if (!professor) throw new AttendanceError("PROFESSOR_NOT_FOUND", "Professor not found");

  const lecture = await prisma.lecture.findUnique({
    where: { id: lectureId },
    include: { subject: { select: { id: true, name: true, code: true } } },
  });
  if (!lecture) throw new AttendanceError("LECTURE_NOT_FOUND", "Lecture not found");
  if (lecture.professorId !== professor.id) {
    throw new AttendanceError("FORBIDDEN", "Lecture belongs to another professor");
  }
  return { professor, lecture };
}

// "3/17" = attended / sessions held so far for the subject.
async function subjectSummary(studentId: number, subjectId: number) {
  const [attended, held] = await Promise.all([
    prisma.attendance.count({ where: { studentId, session: { lecture: { subjectId } } } }),
    prisma.attendanceSession.count({ where: { lecture: { subjectId } } }),
  ]);
  return { attended, held };
}

export class AttendanceService {
  // ─── PROFESSOR ────────────────────────────────────────────

  /** Opens (or resumes) the session for a lecture. Only place the secret is ever returned. */
  static async openSession(professorEmail: string, lectureId: number) {
    const { professor, lecture } = await getOwnedLecture(professorEmail, lectureId);
    const now = new Date();

    let session = await prisma.attendanceSession.findFirst({
      where: { lectureId, status: "ACTIVE", expiresAt: { gt: now } },
      orderBy: { openAt: "desc" },
    });

    if (!session) {
      // Tidy up sessions that expired without being closed.
      await prisma.attendanceSession.updateMany({
        where: { lectureId, status: "ACTIVE" },
        data: { status: "CLOSED", closeAt: now },
      });
      session = await prisma.attendanceSession.create({
        data: {
          lectureId,
          professorId: professor.id,
          token: generateSessionSecret(),
          expiresAt: new Date(now.getTime() + SESSION_DURATION_MS),
        },
      });
    }

    const presentCount = await prisma.attendance.count({ where: { sessionId: session.id } });

    return {
      sessionId: session.id,
      secret: session.token,
      windowMs: WINDOW_MS,
      // The browser signs with its own clock; it corrects by (serverTime - Date.now()).
      serverTime: Date.now(),
      expiresAt: session.expiresAt,
      presentCount,
      lecture: { id: lecture.id, room: lecture.room, subject: lecture.subject },
    };
  }

  /** Polled by the professor's QR page. Owner only. Never includes the secret. */
  static async getSessionStatus(sessionId: number, professorEmail: string) {
    const session = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { _count: { select: { attendances: true } } },
    });
    if (!session) throw new AttendanceError("SESSION_NOT_FOUND", "Session not found");
    await getOwnedLecture(professorEmail, session.lectureId);

    return {
      sessionId: session.id,
      status: isOpen(session) ? "ACTIVE" : "CLOSED",
      serverTime: Date.now(),
      expiresAt: session.expiresAt,
      presentCount: session._count.attendances,
    };
  }

  static async closeSession(sessionId: number, professorEmail: string) {
    const session = await prisma.attendanceSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new AttendanceError("SESSION_NOT_FOUND", "Session not found");
    await getOwnedLecture(professorEmail, session.lectureId);

    const closed = await prisma.attendanceSession.update({
      where: { id: sessionId },
      data: { status: "CLOSED", closeAt: new Date() },
      include: { _count: { select: { attendances: true } } },
    });
    return { sessionId: closed.id, status: "CLOSED", presentCount: closed._count.attendances };
  }

  static async getProfessorLectures(professorEmail: string) {
    const professor = await prisma.professor.findUnique({ where: { email: professorEmail } });
    if (!professor) throw new AttendanceError("PROFESSOR_NOT_FOUND", "Professor not found");

    const now = new Date();
    const lectures = await prisma.lecture.findMany({
      where: { professorId: professor.id },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        professor: { select: { id: true, firstName: true, lastName: true, title: true } },
        sessions: {
          where: { status: "ACTIVE", expiresAt: { gt: now } },
          select: { id: true },
          take: 1,
        },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return lectures.map((l) => ({
      ...formatLecture(l),
      activeSessionId: l.sessions[0]?.id ?? null,
    }));
  }

  // ─── STUDENT ──────────────────────────────────────────────

  /** Drives the "Zabilježi prisustvo" button: an open session for one of the student's subjects. */
  static async getActiveSessionForStudent(email: string) {
    const { student, subjectIds } = await getStudentWithSubjectIds(email);
    if (subjectIds.length === 0) return null;

    const session = await prisma.attendanceSession.findFirst({
      where: {
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
        lecture: { subjectId: { in: subjectIds } },
      },
      include: {
        lecture: { include: { subject: { select: { id: true, name: true, code: true } } } },
        attendances: { where: { studentId: student.id }, select: { id: true } },
      },
      orderBy: { openAt: "desc" },
    });
    if (!session) return null;

    return {
      sessionId: session.id,
      room: session.lecture.room,
      subject: session.lecture.subject,
      alreadyRecorded: session.attendances.length > 0,
    };
  }

  static async scan(email: string, payload: string) {
    const qr = parseQrPayload(payload);
    if (!qr) throw new AttendanceError("INVALID_QR", "Not an attendance QR code");

    const session = await prisma.attendanceSession.findUnique({
      where: { id: qr.sessionId },
      include: { lecture: { include: { subject: { select: { id: true, name: true } } } } },
    });
    if (!session) throw new AttendanceError("INVALID_QR", "Unknown session");
    if (!isOpen(session)) throw new AttendanceError("SESSION_CLOSED", "Session is closed");
    if (!verifyQr(session.token, qr)) throw new AttendanceError("QR_EXPIRED", "QR code expired");

    const { student, subjectIds } = await getStudentWithSubjectIds(email);
    const subject = session.lecture.subject;
    if (!subjectIds.includes(subject.id)) {
      throw new AttendanceError("NOT_ENROLLED", "Student does not attend this subject");
    }

    // Idempotent: scanning twice is not an error, it just reports the existing record.
    let alreadyRecorded = false;
    let scannedAt: Date;
    try {
      const created = await prisma.attendance.create({
        data: { sessionId: session.id, studentId: student.id },
      });
      scannedAt = created.scannedAt;
    } catch (error: any) {
      if (error?.code !== "P2002") throw error;
      alreadyRecorded = true;
      const existing = await prisma.attendance.findUnique({
        where: { sessionId_studentId: { sessionId: session.id, studentId: student.id } },
      });
      scannedAt = existing?.scannedAt ?? new Date();
    }

    const { attended, held } = await subjectSummary(student.id, subject.id);
    return { subject, room: session.lecture.room, scannedAt, alreadyRecorded, attended, held };
  }

  /** Per-subject attendance for the student, plus an overall percentage. */
  static async getStudentSummary(email: string) {
    const { student, subjectIds } = await getStudentWithSubjectIds(email);

    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    });

    const rows = await Promise.all(
      subjects.map(async (subject) => {
        const { attended, held } = await subjectSummary(student.id, subject.id);
        return {
          subject,
          attended,
          held,
          percentage: held > 0 ? Math.round((attended / held) * 100) : null,
        };
      }),
    );

    const totalAttended = rows.reduce((sum, r) => sum + r.attended, 0);
    const totalHeld = rows.reduce((sum, r) => sum + r.held, 0);

    return {
      subjects: rows,
      attended: totalAttended,
      held: totalHeld,
      percentage: totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : null,
    };
  }
}
