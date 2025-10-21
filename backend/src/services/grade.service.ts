import { getPrismaClient } from "../config/database";

const prisma = getPrismaClient();

export class GradeService {
  /**
   * Create new grade
   */
  static async createGrade(data: {
    studentId?: number;
    studentEmail?: string;
    subjectId: number;
    grade: number;
    points?: number;
    examType?: string;
    academicYear?: string;
  }) {
    let studentId = data.studentId;

    // If email provided, find student
    if (data.studentEmail && !studentId) {
      const student = await prisma.student.findUnique({
        where: { email: data.studentEmail },
      });
      if (!student) {
        throw new Error("Student not found");
      }
      studentId = student.id;
    }

    if (!studentId) {
      throw new Error("Student ID or email required");
    }

    // Verify subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: data.subjectId },
    });
    if (!subject) {
      throw new Error("Subject not found");
    }

    const academicYear =
      data.academicYear ||
      `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;

    const grade = await prisma.grade.create({
      data: {
        studentId,
        subjectId: data.subjectId,
        grade: data.grade,
        points: data.points || Math.min(100, 60 + subject.ects * 5),
        examDate: new Date(),
        examType: (data.examType as any) || "REGULAR",
        academicYear,
      },
      include: {
        subject: true,
        student: true,
      },
    });

    return grade;
  }

  /**
   * Get grades by student ID or email
   */
  static async getStudentGrades(studentId?: number, studentEmail?: string) {
    let id = studentId;

    if (studentEmail && !id) {
      const student = await prisma.student.findUnique({
        where: { email: studentEmail },
      });
      if (!student) {
        return null;
      }
      id = student.id;
    }

    if (!id) {
      return null;
    }

    const grades = await prisma.grade.findMany({
      where: { studentId: id },
      include: { subject: true },
      orderBy: { examDate: "desc" },
    });

    return grades;
  }

  /**
   * Get grades by subject ID
   */
  static async getSubjectGrades(subjectId: number) {
    const grades = await prisma.grade.findMany({
      where: { subjectId },
      include: { student: true, subject: true },
      orderBy: { examDate: "desc" },
    });

    return grades;
  }

  /**
   * Update grade
   */
  static async updateGrade(
    id: number,
    data: {
      grade?: number;
      points?: number;
      examType?: string;
    }
  ) {
    const grade = await prisma.grade.findUnique({
      where: { id },
    });

    if (!grade) {
      throw new Error("Grade not found");
    }

    const updated = await prisma.grade.update({
      where: { id },
      data: {
        grade: data.grade ?? grade.grade,
        points: data.points ?? grade.points,
        examType: (data.examType as any) ?? grade.examType,
      },
      include: { subject: true, student: true },
    });

    return updated;
  }

  /**
   * Delete grade
   */
  static async deleteGrade(id: number) {
    const grade = await prisma.grade.findUnique({
      where: { id },
    });

    if (!grade) {
      throw new Error("Grade not found");
    }

    await prisma.grade.delete({
      where: { id },
    });
  }
}
