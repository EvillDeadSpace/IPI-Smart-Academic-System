import { getPrismaClient } from "../config/database";

const prisma = getPrismaClient();

export class ExamService {
  /**
   * Create new exam
   */
  static async createExam(data: {
    subjectId: number;
    professorId: number;
    examTime: Date;
    location?: string;
    maxPoints?: number;
  }) {
    const { subjectId, professorId, examTime, location, maxPoints } = data;

    // Verify subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new Error("Subject not found");
    }

    // Verify professor exists
    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
    });
    if (!professor) {
      throw new Error("Professor not found");
    }

    const exam = await prisma.exam.create({
      data: {
        subjectId,
        professorId,
        examTime: new Date(examTime),
        location: location || null,
        maxPoints: maxPoints || 100,
      },
      include: {
        subject: true,
        professor: true,
      },
    });

    return exam;
  }

  /**
   * Get exams by professor ID
   */
  static async getExamsByProfessor(professorId: number) {
    const exams = await prisma.exam.findMany({
      where: { professorId },
      include: { subject: true },
      orderBy: { examTime: "asc" },
    });

    return exams;
  }

  /**
   * Get exams for student by email
   */
  static async getExamsByStudent(email: string) {
    const student = await prisma.student.findUnique({
      where: { email },
      include: { subjectEnrollments: { include: { subject: true } } },
    });

    if (!student) {
      return null;
    }

    const subjectIds = student.subjectEnrollments.map((e) => e.subjectId);

    const exams = await prisma.exam.findMany({
      where: { subjectId: { in: subjectIds } },
      include: { subject: true, professor: true },
      orderBy: { examTime: "asc" },
    });

    return exams;
  }

  /**
   * Get exam by ID
   */
  static async getExamById(id: number) {
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: { subject: true, professor: true },
    });

    return exam;
  }

  /**
   * Register student for exam
   */
  static async registerForExam(examId: number, studentEmail: string) {
    const student = await prisma.student.findUnique({
      where: { email: studentEmail },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new Error("Exam not found");
    }

    // Check if already registered
    const existing = await prisma.studentExamRegistration.findUnique({
      where: {
        studentId_examId: {
          studentId: student.id,
          examId,
        },
      },
    });

    if (existing) {
      throw new Error("Already registered for this exam");
    }

    const registration = await prisma.studentExamRegistration.create({
      data: {
        studentId: student.id,
        examId,
      },
    });

    return registration;
  }

  /**
   * Delete exam
   */
  static async deleteExam(id: number) {
    const exam = await prisma.exam.findUnique({
      where: { id },
    });

    if (!exam) {
      throw new Error("Exam not found");
    }

    await prisma.exam.delete({
      where: { id },
    });
  }
}
