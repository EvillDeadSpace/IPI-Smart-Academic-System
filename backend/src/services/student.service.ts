import prisma from "../config/database";

export class StudentService {
  /**
   * Get all students
   */
  static async getAllStudents() {
    return await prisma.student.findMany({
      include: { major: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get student by ID
   */
  static async getStudentById(id: number) {
    return await prisma.student.findUnique({
      where: { id },
      include: {
        major: true,
        yearEnrollments: true,
        subjectEnrollments: { include: { subject: true } },
        grades: { include: { subject: true } },
      },
    });
  }

  /**
   * Get student by email
   */
  static async getStudentByEmail(email: string) {
    return await prisma.student.findUnique({
      where: { email },
      include: {
        major: true,
        yearEnrollments: true,
        subjectEnrollments: { include: { subject: true } },
        grades: { include: { subject: true } },
      },
    });
  }

  /**
   * Get student progress
   */
  static async getStudentProgress(email: string) {
    const student = await this.getStudentByEmail(email);
    if (!student) return null;

    const passedSubjects = student.grades.filter((g) => g.grade >= 6);
    const totalECTSEarned = passedSubjects.reduce(
      (sum, g) => sum + g.subject.ects,
      0
    );
    const enrolledECTS = student.subjectEnrollments.reduce(
      (sum, e) => sum + e.subject.ects,
      0
    );

    const currentYear = student.currentYear;
    const requiredECTSForNextYear = currentYear * 48;
    const canProgressToNextYear = totalECTSEarned >= requiredECTSForNextYear;

    return {
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        indexNumber: student.indexNumber,
        currentYear: student.currentYear,
        status: student.status,
      },
      major: {
        id: student.major.id,
        name: student.major.name,
        code: student.major.code,
        duration: student.major.duration,
      },
      progress: {
        currentYear: student.currentYear,
        totalECTSEarned,
        enrolledECTS,
        passedSubjects: passedSubjects.length,
        totalSubjects: student.subjectEnrollments.length,
        canProgressToNextYear,
        nextYear:
          currentYear + 1 <= student.major.duration ? currentYear + 1 : null,
        ectsNeededForNextYear: Math.max(
          0,
          requiredECTSForNextYear - totalECTSEarned
        ),
      },
      yearEnrollments: student.yearEnrollments,
      subjectEnrollments: student.subjectEnrollments.map((e) => ({
        id: e.subject.id,
        name: e.subject.name,
        ects: e.subject.ects,
        semester: e.semester,
        academicYear: e.academicYear,
      })),
    };
  }

  /**
   * Get student grades
   */
  static async getStudentGrades(email: string) {
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) return null;

    return await prisma.grade.findMany({
      where: { studentId: student.id },
      include: { subject: true },
      orderBy: { examDate: "desc" },
    });
  }

  /**
   * Update student
   */
  static async updateStudent(id: number, data: any) {
    return await prisma.student.update({
      where: { id },
      data,
      include: { major: true },
    });
  }

  /**
   * Delete student
   */
  static async deleteStudent(id: number) {
    return await prisma.student.delete({ where: { id } });
  }
}
