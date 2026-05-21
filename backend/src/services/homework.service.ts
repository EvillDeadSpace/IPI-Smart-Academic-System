import { getPrismaClient } from "../config/database";

const prisma = getPrismaClient();

export class HomeworkService {
  static async createHomework(data: {
    title: string;
    description?: string;
    s3Path: string;
    dueDate: Date;
    subjectId: number;
    professorId: number;
  }) {
    const subject = await prisma.subject.findUnique({
      where: { id: data.subjectId },
    });
    if (!subject) throw new Error("Subject not found");

    const professor = await prisma.professor.findUnique({
      where: { id: data.professorId },
    });
    if (!professor) throw new Error("Professor not found");

    return await prisma.homework.create({
      data: {
        title: data.title,
        description: data.description || null,
        s3Path: data.s3Path,
        dueDate: new Date(data.dueDate),
        subjectId: data.subjectId,
        professorId: data.professorId,
      },
      include: { subject: true },
    });
  }

  static async getHomeworksByProfessor(professorId: number) {
    return await prisma.homework.findMany({
      where: { professorId },
      include: { subject: true },
      orderBy: { dueDate: "asc" },
    });
  }

  static async getHomeworksByStudent(studentEmail: string) {
    const student = await prisma.student.findUnique({
      where: { email: studentEmail },
      include: { subjectEnrollments: true },
    });

    if (!student) return null;

    const subjectIds = student.subjectEnrollments.map((e) => e.subjectId);

    return await prisma.homework.findMany({
      where: { subjectId: { in: subjectIds } },
      include: { subject: true },
      orderBy: { dueDate: "asc" },
    });
  }

  static async getHomeworkStats(studentEmail: string) {
    const student = await prisma.student.findUnique({
      where: { email: studentEmail },
      include: { subjectEnrollments: { include: { subject: true } } },
    });

    if (!student) return null;

    const subjectIds = student.subjectEnrollments.map((e) => e.subjectId);

    const allAssignments = await prisma.assignment.findMany({
      where: { subjectId: { in: subjectIds } },
      orderBy: { dueDate: "asc" },
    });

    const now = new Date();
    // Monday-based week (ISO)
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const thisWeek = allAssignments.filter(
      (a) => a.dueDate >= startOfWeek && a.dueDate <= endOfWeek,
    ).length;

    const totalEcts = student.subjectEnrollments.reduce((sum, e) => sum + e.subject.ects, 0);
    const avgEcts =
      student.subjectEnrollments.length > 0 ? totalEcts / student.subjectEnrollments.length : 0;

    return {
      total: allAssignments.length,
      thisWeek,
      avgEcts: Math.round(avgEcts * 10) / 10,
    };
  }
}
