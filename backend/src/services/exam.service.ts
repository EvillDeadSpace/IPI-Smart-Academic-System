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

  /**
   * Get available exams for student (not registered yet)
   */
  static async getAvailableExams(email: string) {
    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        subjectEnrollments: { include: { subject: true } },
        examRegistrations: { include: { exam: true } },
      },
    });

    if (!student) {
      return null;
    }

    const subjectIds = student.subjectEnrollments.map((e) => e.subjectId);
    const registeredExamIds = student.examRegistrations.map((r) => r.examId);

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get exams for enrolled subjects that student hasn't registered for
    const exams = await prisma.exam.findMany({
      where: {
        subjectId: { in: subjectIds },
        id: { notIn: registeredExamIds },
        examTime: { gte: today }, // Only exams from today onwards
      },
      include: {
        subject: true,
        professor: true,
      },
      orderBy: { examTime: "asc" },
    });

    return exams;
  }

  /**
   * Get registered exams for student
   */
  static async getRegisteredExams(email: string) {
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        examRegistrations: {
          include: {
            exam: {
              include: {
                subject: true,
                professor: true,
              },
            },
          },
          where: {
            exam: {
              examTime: { gte: today }, // Only exams from today onwards
            },
          },
          orderBy: {
            exam: {
              examTime: "asc",
            },
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    return student.examRegistrations;
  }

  /**
   * Get completed exams for student (with grades)
   */
  static async getCompletedExams(email: string) {
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        examRegistrations: {
          include: {
            exam: {
              include: {
                subject: true,
                professor: true,
              },
            },
          },
          where: {
            exam: {
              examTime: { lt: today }, // Only exams before today
            },
          },
          orderBy: {
            exam: {
              examTime: "desc",
            },
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    // Get grades for completed exams
    const grades = await prisma.grade.findMany({
      where: { studentId: student.id },
      include: {
        subject: true,
      },
    });

    // Map past exam registrations to exam format with grades if available
    const completedExams = student.examRegistrations.map((registration) => {
      const grade = grades.find(
        (g) => g.subjectId === registration.exam.subjectId
      );
      return {
        ...registration.exam,
        grade: grade?.grade || null,
      };
    });

    return completedExams;
  }

  /**
   * Unregister student from exam
   */
  static async unregisterFromExam(registrationId: number) {
    const registration = await prisma.studentExamRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      throw new Error("Registration not found");
    }

    await prisma.studentExamRegistration.delete({
      where: { id: registrationId },
    });

    return { message: "Unregistered successfully" };
  }

  /**
   * Get all exams for calendar view (current month only)
   */
  static async getAllExamsForCalendar() {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const exams = await prisma.exam.findMany({
      where: {
        examTime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        subject: true,
        professor: true,
      },
      orderBy: { examTime: "asc" },
    });

    return exams;
  }
}
