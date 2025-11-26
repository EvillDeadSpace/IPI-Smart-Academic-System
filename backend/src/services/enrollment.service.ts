import { getPrismaClient } from "../config/database";

const prisma = getPrismaClient();

export class EnrollmentService {
  /**
   * Get all majors with subjects grouped by year
   */
  static async getMajorsWithSubjects() {
    const majors = await prisma.major.findMany({
      include: {
        subjects: {
          orderBy: [{ yearPlan: { year: "asc" } }, { isElective: "asc" }],
          include: {
            yearPlan: true,
          },
        },
      },
    });

    // Transform to cleaner structure
    return majors.map((major) => ({
      id: major.id,
      name: major.name,
      code: major.code,
      description: major.description,
      duration: major.duration,
      subjects: major.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        ects: s.ects,
        isElective: s.isElective,
        year: s.yearPlan.year,
        semester: s.yearPlan.semester,
      })),
    }));
  }

  /**
   * Enroll student in a year with subjects
   */
  static async enrollStudent(data: {
    email: string;
    majorName: string;
    year: number;
    subjects: number[];
  }) {
    const { email, majorName, year, subjects } = data;

    // Find student
    const student = await prisma.student.findUnique({
      where: { email },
      include: { major: true, yearEnrollments: true },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // Find major
    const major = await prisma.major.findUnique({
      where: { name: majorName },
    });

    if (!major) {
      throw new Error("Major not found");
    }

    // Check if already enrolled in current academic year
    const academicYear = `${new Date().getFullYear()}/${
      new Date().getFullYear() + 1
    }`;
    const existingEnrollment = await prisma.yearEnrollment.findUnique({
      where: {
        studentId_academicYear: {
          studentId: student.id,
          academicYear,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error(`Already enrolled in academic year ${academicYear}`);
    }

    // PROGRESSION LOGIC: Check ECTS requirements for year > 1
    if (year > 1) {
      const studentGrades = await prisma.grade.findMany({
        where: {
          studentId: student.id,
          grade: { gte: 6 }, // Only passed exams
        },
        include: { subject: true },
      });

      const earnedECTS = studentGrades.reduce(
        (sum, g) => sum + g.subject.ects,
        0
      );
      const requiredECTS = (year - 1) * 48;

      if (earnedECTS < requiredECTS) {
        throw new Error(
          `Cannot enroll in year ${year}. You need ${requiredECTS} ECTS but only have ${earnedECTS}.`
        );
      }
    }

    // Fetch selected subjects
    const selectedSubjects = await prisma.subject.findMany({
      where: { id: { in: subjects } },
      include: { yearPlan: true },
    });

    if (selectedSubjects.length !== subjects.length) {
      throw new Error("Invalid subject IDs");
    }

    // Validate subjects belong to correct major and year
    const invalidSubjects = selectedSubjects.filter(
      (s) => s.majorId !== major.id || s.yearPlan.year !== year
    );
    if (invalidSubjects.length > 0) {
      throw new Error("Some subjects do not belong to selected major/year");
    }

    // Calculate total ECTS
    const totalECTS = selectedSubjects.reduce((sum, s) => sum + s.ects, 0);
    if (totalECTS < 30) {
      throw new Error(
        `Insufficient ECTS. You have ${totalECTS}, minimum is 30.`
      );
    }

    // Validate all required subjects included
    const requiredSubjects = selectedSubjects.filter((s) => !s.isElective);
    const allRequiredSubjects = await prisma.subject.findMany({
      where: {
        majorId: major.id,
        isElective: false,
        yearPlan: { year },
      },
    });

    const missingRequired = allRequiredSubjects.filter(
      (req) => !requiredSubjects.find((sel) => sel.id === req.id)
    );
    if (missingRequired.length > 0) {
      throw new Error(
        `Missing required subjects: ${missingRequired
          .map((s) => s.name)
          .join(", ")}`
      );
    }

    // Validate at least 2 elective subjects
    const electiveSubjects = selectedSubjects.filter((s) => s.isElective);
    if (electiveSubjects.length < 2) {
      throw new Error("You must select at least 2 elective subjects");
    }

    // Create enrollment in transaction
    const result = await prisma.$transaction(async (tx) => {
      const yearEnrollment = await tx.yearEnrollment.create({
        data: {
          studentId: student.id,
          academicYear,
          year,
        },
      });

      const subjectEnrollments = await Promise.all(
        selectedSubjects.map((subject) =>
          tx.subjectEnrollment.create({
            data: {
              studentId: student.id,
              subjectId: subject.id,
              academicYear,
              semester: subject.yearPlan.semester,
            },
          })
        )
      );

      await tx.student.update({
        where: { id: student.id },
        data: { currentYear: year },
      });

      return { yearEnrollment, subjectEnrollments };
    });

    return {
      message: "Successfully enrolled",
      yearEnrollment: result.yearEnrollment,
      enrolledSubjects: result.subjectEnrollments.length,
      totalECTS,
    };
  }

  /**
   * Get student enrollments
   */
  static async getStudentEnrollments(email: string) {
    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        yearEnrollments: {
          orderBy: { enrolledAt: "desc" },
        },
        subjectEnrollments: {
          include: { subject: true },
        },
      },
    });

    if (!student) {
      return null;
    }

    return {
      yearEnrollments: student.yearEnrollments,
      subjectEnrollments: student.subjectEnrollments,
    };
  }

  /**
   * Delete enrollment
   */
  static async deleteEnrollment(id: number) {
    await prisma.yearEnrollment.delete({
      where: { id },
    });
  }
}
