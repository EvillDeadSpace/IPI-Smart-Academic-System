import { getPrismaClient } from "../config/database";
import { getSubjectColor } from "../utils/subjectColor";

const prisma = getPrismaClient();

export class AssignmentService {
  static async createAssignment(data: {
    title: string;
    description?: string;
    type: string;
    difficulty?: string;
    dueDate: Date;
    maxPoints: number;
    professorS3Path?: string;
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

    const difficultyMap: Record<string, "LAGAN" | "SREDNJE" | "TESKO"> = {
      Lagan: "LAGAN",
      Srednje: "SREDNJE",
      "Težak": "TESKO",
    };

    return await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        difficulty: difficultyMap[data.difficulty ?? "Srednje"] ?? "SREDNJE",
        dueDate: new Date(data.dueDate),
        maxPoints: data.maxPoints,
        professorS3Path: data.professorS3Path || null,
        subjectId: data.subjectId,
        professorId: data.professorId,
      },
      include: { subject: true },
    });
  }

  static async getAssignmentsByProfessor(professorId: number) {
    return await prisma.assignment.findMany({
      where: { professorId },
      include: {
        subject: true,
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                indexNumber: true,
              },
            },
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });
  }

  static async getAssignmentsByStudent(studentEmail: string) {
    const student = await prisma.student.findUnique({
      where: { email: studentEmail },
      include: { subjectEnrollments: true },
    });

    if (!student) return null;

    const subjectIds = student.subjectEnrollments.map((e) => e.subjectId);

    const assignments = await prisma.assignment.findMany({
      where: { subjectId: { in: subjectIds } },
      include: {
        subject: true,
        submissions: {
          where: { studentId: student.id },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    return assignments.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      type: a.type,
      difficulty: a.difficulty,
      dueDate: a.dueDate,
      maxPoints: a.maxPoints,
      professorS3Path: a.professorS3Path,
      createdAt: a.createdAt,
      subject: {
        ...a.subject,
        color: getSubjectColor(a.subject.id),
      },
      submission: a.submissions[0] || null,
    }));
  }

  static async submitAssignment(
    assignmentId: number,
    studentEmail: string,
    s3Path: string
  ) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });
    if (!assignment) throw new Error("Assignment not found");

    const student = await prisma.student.findUnique({
      where: { email: studentEmail },
    });
    if (!student) throw new Error("Student not found");

    return await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: { assignmentId, studentId: student.id },
      },
      create: {
        assignmentId,
        studentId: student.id,
        s3Path,
        status: "PENDING",
        submittedAt: new Date(),
      },
      update: {
        s3Path,
        status: "PENDING",
        submittedAt: new Date(),
      },
    });
  }

  static async gradeSubmission(
    assignmentId: number,
    studentEmail: string,
    pointsEarned: number,
    feedback: string | undefined,
    gradedById: number
  ) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });
    if (!assignment) throw new Error("Assignment not found");

    if (pointsEarned < 0 || pointsEarned > assignment.maxPoints) {
      throw new Error(
        `Points must be between 0 and ${assignment.maxPoints}`
      );
    }

    const student = await prisma.student.findUnique({
      where: { email: studentEmail },
    });
    if (!student) throw new Error("Student not found");

    return await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: student.id,
        },
      },
      create: {
        assignmentId,
        studentId: student.id,
        pointsEarned,
        feedback: feedback || null,
        status: "GRADED",
        gradedAt: new Date(),
        gradedById,
      },
      update: {
        pointsEarned,
        feedback: feedback || null,
        status: "GRADED",
        gradedAt: new Date(),
        gradedById,
      },
    });
  }

  static async getAssignmentProgressBySubject(studentEmail: string) {
    const student = await prisma.student.findUnique({
      where: { email: studentEmail },
      include: {
        subjectEnrollments: {
          include: { subject: true },
        },
      },
    });

    if (!student) return null;

    const subjectIds = student.subjectEnrollments.map((e) => e.subjectId);

    const assignments = await prisma.assignment.findMany({
      where: { subjectId: { in: subjectIds } },
      include: {
        submissions: {
          where: { studentId: student.id },
        },
      },
    });

    return student.subjectEnrollments.map((enrollment) => {
      const subjectAssignments = assignments.filter(
        (a) => a.subjectId === enrollment.subjectId
      );

      const maxPoints = subjectAssignments.reduce(
        (sum, a) => sum + a.maxPoints,
        0
      );

      const earnedPoints = subjectAssignments.reduce((sum, a) => {
        const submission = a.submissions[0];
        return sum + (submission?.pointsEarned ?? 0);
      }, 0);

      const gradedCount = subjectAssignments.filter(
        (a) => a.submissions[0]?.status === "GRADED"
      ).length;

      return {
        subjectId: enrollment.subjectId,
        subjectName: enrollment.subject.name,
        subjectCode: enrollment.subject.code,
        subjectColor: getSubjectColor(enrollment.subjectId),
        assignmentPoints: {
          earned: earnedPoints,
          max: maxPoints,
          graded: gradedCount,
          total: subjectAssignments.length,
        },
      };
    });
  }
}
