import prisma from "../config/database";

/**
 * Service for managing student schedules and academic plans
 */
export class ScheduleService {
  /**
   * Retrieves the academic schedule for a student by email
   * @param email - Student's email address
   * @returns Student information with subjects for current year
   * @throws Error if student not found
   */
  static async getScheduleByEmail(email: string) {
    // 1. Find student by email with major information
    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        major: true,
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // 2. Find YearPlan for student's major and current year
    const yearPlans = await prisma.yearPlan.findMany({
      where: {
        majorId: student.majorId,
        year: student.currentYear,
      },
      include: {
        subjects: {
          include: {
            professors: {
              include: {
                professor: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { semester: "asc" },
    });

    // 3. Extract all subjects from year plans and format data
    const subjects = yearPlans.flatMap((plan) =>
      plan.subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        ects: subject.ects,
        semester: plan.semester,
        isElective: subject.isElective,
        professor:
          subject.professors.length > 0
            ? {
                id: subject.professors[0].professor.id,
                firstName: subject.professors[0].professor.firstName,
                lastName: subject.professors[0].professor.lastName,
                fullName: `${subject.professors[0].professor.firstName} ${subject.professors[0].professor.lastName}`,
              }
            : null,
      }))
    );

    // 4. Transform data for frontend consumption
    return {
      student: {
        firstName: student.firstName,
        lastName: student.lastName,
        majorName: student.major.name,
        currentYear: student.currentYear,
      },
      subjects: subjects,
      totalSubjects: subjects.length,
      requiredSubjects: subjects.filter((s) => !s.isElective).length,
      electiveSubjects: subjects.filter((s) => s.isElective).length,
      totalECTS: subjects.reduce((sum, s) => sum + s.ects, 0),
    };
  }
}
