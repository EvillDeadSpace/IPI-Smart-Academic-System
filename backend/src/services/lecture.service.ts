import prisma from "../config/database";
import { buildNextLectureResponse, formatLecture } from "../utils/helperFunction";

type createLectureData = {
  subjectId: number;
  professorId: number;
  dayOfWeek: number; // 0=Monday ... 4=Friday
  startTime: string; //
  endOfTime: string; //
  room: string;
};

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

    const duplicate = await prisma.lecture.findFirst({
      where: {
        room: data.room,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
      },
    });

    if (duplicate) {
      throw Error("There is already a lecture scheduled in this room at the same time");
    }

    return prisma.lecture.create({
      data,
      include: {
        subject: { select: { id: true, name: true, code: true } },
        professor: { select: { id: true, firstName: true, lastName: true, title: true } },
      },
    });
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

    if (allLectures.length === 0) return null;

    // Find next lecture for studnet
    // Find today's lecture that has not started yet
    const todayUpcoming = allLectures.find(
      (l) => l.dayOfWeek === currentDay && l.startTime > currentTime,
    );
    if (todayUpcoming) {
      return buildNextLectureResponse(todayUpcoming, now, currentDay, currentTime);
    }

    // If not have to day find next lecture in the week
    for (let d = currentDay + 1; d <= 6; d++) {
      const next = allLectures.find((l) => l.dayOfWeek === d);
      if (next) {
        return buildNextLectureResponse(next, now, currentDay, currentTime);
      }
    }

    // If not have next lecture in the week, return first lecture in the next week
    const firstNext = allLectures[0];
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

    return lectures.map((l) => formatLecture(l));
  }
}
