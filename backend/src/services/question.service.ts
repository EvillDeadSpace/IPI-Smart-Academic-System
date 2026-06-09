import { getPrismaClient } from "../config/database";

const prisma = getPrismaClient();

export class QuestionServices {
  static async createQuestion(data: { studentEmail: string; text: string; assignmentId: number }) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: data.assignmentId },
    });

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    const student = await prisma.student.findUnique({
      where: { email: data.studentEmail },
    });

    if (!student) {
      throw new Error("Studnet not found");
    }

    return await prisma.question.create({
      data: {
        text: data.text,
        studentId: student.id,
        assignmentId: assignment.id,
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  static async getQuestion(assignmentId: number) {
    return await prisma.question.findMany({
      where: {
        assignmentId,
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  static async answerQuestion(data: { questionId: number; answerText: string }) {
    return await prisma.question.update({
      where: {
        id: data.questionId,
      },
      data: {
        answer: data.answerText,
        answeredAt: new Date(),
      },
    });
  }
}
