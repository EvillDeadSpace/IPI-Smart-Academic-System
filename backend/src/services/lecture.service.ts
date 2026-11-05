import prisma from "../config/database";
import { buildNextLectureResponse, formatLecture } from "../utils/helperFunction";
import {
  ScheduleSlot,
  findRoomConflict,
  isActiveOn,
  normalizeRoom,
  todayInSarajevo,
} from "../utils/lectureCalendar";

export type LectureType = "LECTURE" | "EXERCISE";

type createLectureData = {
  subjectId: number;
  professorId: number;
  dayOfWeek: number; // 0=Monday ... 6=Sunday
  startTime: string; //
  endOfTime: string; //
  room: string;
  type: LectureType;
  startDate: Date | null;
  endDate: Date | null;
};

type LecturePeriodData = { type: LectureType; startDate: Date | null; endDate: Date | null };

const TYPE_LABEL: Record<LectureType, string> = { LECTURE: "predavanje", EXERCISE: "vježbe" };
const DAY_LABEL = [
  "ponedjeljkom",
  "utorkom",
  "srijedom",
  "četvrtkom",
  "petkom",
  "subotom",
  "nedjeljom",
];

/** Room already taken → 409 with a message the admin UI shows as-is (Bosnian). */
export class LectureConflictError extends Error {
  readonly status = 409;
}

async function assertRoomFree(candidate: ScheduleSlot) {
  const sameDay = await prisma.lecture.findMany({
    where: { dayOfWeek: candidate.dayOfWeek },
    include: { subject: { select: { name: true } } },
  });
  const clash = findRoomConflict(candidate, sameDay);
  if (clash) {
    throw new LectureConflictError(
      `Sala ${normalizeRoom(clash.room)} je zauzeta: ${clash.subject.name} (${
        TYPE_LABEL[clash.type as LectureType]
      }) ${DAY_LABEL[clash.dayOfWeek]} ${clash.startTime}–${clash.endOfTime}.`,
    );
  }
}

export class LectureService {
  static async createLecture(data: createLectureData) {
    // check if subject and professor is here
    const subject = await prisma.subject.findUnique({
      where: {
        id: data.subjectId,
      },
    });
    if (!subject) {
      throw Error("Subject not found");
    }

    const professor = await prisma.professor.findUnique({
      where: {
        id: data.professorId,
      },
    });

    if (!professor) {
      throw Error("Professor not found");
    }

    // Same room + weekday + overlapping time + overlapping period = clash.
    // Different periods (winter vs summer) may reuse the room.
    await assertRoomFree(data);

    const created = await prisma.lecture.create({
      data,
      include: {
        subject: { select: { id: true, name: true, code: true } },
        professor: { select: { id: true, firstName: true, lastName: true, title: true } },
      },
    });
    return formatLecture(created);
  }

  /** Admin: set predavanje/vježbe and the period for an existing weekly slot. */
  static async updateLecturePeriod(id: number, data: LecturePeriodData) {
    const lecture = await prisma.lecture.findUnique({ where: { id } });
    if (!lecture) throw new Error("Lecture not found");

    // A longer period can run into another slot in the same room.
    await assertRoomFree({ ...lecture, ...data });

    const updated = await prisma.lecture.update({
      where: { id },
      data,
      include: {
        subject: { select: { id: true, name: true, code: true } },
        professor: { select: { id: true, firstName: true, lastName: true, title: true } },
      },
    });
    return formatLecture(updated);
  }

  // Get all lecture for admin panel
  static async getAllLectures() {
    const lectures = await prisma.lecture.findMany({
      include: {
        subject: { select: { id: true, name: true, code: true } },
        professor: { select: { id: true, firstName: true, lastName: true, title: true } },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return lectures.map((l) => formatLecture(l));
  }

  static async getNextLecture(email: string) {
    // Find studnet and lecture
    const student = await prisma.student.findUnique({
      where: { email },
      include: { major: true },
    });
    if (!student) throw new Error("Student not found");

    const yearPlans = await prisma.yearPlan.findMany({
      where: { majorId: student.majorId, year: student.currentYear },
      include: { subjects: true },
    });

    const subjectIds = yearPlans.flatMap((plan) => plan.subjects.map((s) => s.id));
    if (subjectIds.length === 0) return null;

    // Setup time and data — sve u Europe/Sarajevo da izbjegnemo UTC offset
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Sarajevo" }));

    const jsDay = now.getDay();
    const currentDay = jsDay === 0 ? 6 : jsDay - 1; // 0=pon ... 5=sub, 6=ned
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    // Get all lecture for student
    const allLectures = await prisma.lecture.findMany({
      where: { subjectId: { in: subjectIds } },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        professor: { select: { id: true, firstName: true, lastName: true, title: true } },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    // Only slots whose period is running today (lectures that ended in December don't come back).
    // ponytail: a slot starting later this week is skipped until its start date; fine for weekly cadence.
    const today = todayInSarajevo();
    const activeLectures = allLectures.filter((l) => isActiveOn(l, today));
    if (activeLectures.length === 0) return null;

    // Find next lecture for studnet
    // Find today's lecture that has not started yet
    const todayUpcoming = activeLectures.find(
      (l) => l.dayOfWeek === currentDay && l.startTime > currentTime,
    );
    if (todayUpcoming) {
      return buildNextLectureResponse(todayUpcoming, now, currentDay, currentTime);
    }

    // If not have to day find next lecture in the week
    for (let d = currentDay + 1; d <= 6; d++) {
      const next = activeLectures.find((l) => l.dayOfWeek === d);
      if (next) {
        return buildNextLectureResponse(next, now, currentDay, currentTime);
      }
    }

    // If not have next lecture in the week, return first lecture in the next week
    const firstNext = activeLectures[0];
    return buildNextLectureResponse(firstNext, now, currentDay, currentTime);
  }

  static async deleteLecture(id: number) {
    const lecture = await prisma.lecture.findUnique({ where: { id } });
    if (!lecture) throw new Error("Lecture not found");

    await prisma.lecture.delete({ where: { id } });
    return { message: "Lecture deleted successfully" };
  }

  // ─── STUDENT: GET ALL LECTURE ────────────────────
  static async getLecturesByStudent(email: string) {
    const student = await prisma.student.findUnique({
      where: { email },
      include: { major: true },
    });
    if (!student) throw new Error("Student not found");

    const yearPlans = await prisma.yearPlan.findMany({
      where: { majorId: student.majorId, year: student.currentYear },
      include: { subjects: true },
    });

    const subjectIds = yearPlans.flatMap((plan) => plan.subjects.map((s) => s.id));
    if (subjectIds.length === 0) return [];

    const lectures = await prisma.lecture.findMany({
      where: { subjectId: { in: subjectIds } },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        professor: { select: { id: true, firstName: true, lastName: true, title: true } },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    // Weekly schedule shows slots that haven't ended yet (current + upcoming periods).
    const today = todayInSarajevo();
    return lectures
      .filter((l) => isActiveOn({ startDate: null, endDate: l.endDate }, today))
      .map((l) => formatLecture(l));
  }
}
