import { getPrismaClient } from "../config/database";

const prisma = getPrismaClient();

export class CommentService {
  // Get all comments for a specific news item
  static async getCommentsByNewsId(newsId: number) {
    const comments = await prisma.comment.findMany({
      where: { newsId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return comments;
  }

  // Create a new comment
  static async createComment(data: {
    content: string;
    email: string;
    newsId: number;
  }) {
    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email: data.email },
    });

    if (!student) {
      throw new Error("User not found");
    }

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        userId: student.id,
        newsId: data.newsId,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return comment;
  }

  // Update a comment (only owner can)
  static async updateComment(id: string, content: string, userId: number) {
    const existing = await prisma.comment.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return null;
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updated;
  }

  // Delete a comment (only owner can)
  static async deleteComment(id: string, email: string) {
    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return false;
    }

    const existing = await prisma.comment.findFirst({
      where: { id, userId: student.id },
    });

    if (!existing) {
      return false;
    }

    await prisma.comment.delete({
      where: { id },
    });

    return true;
  }
}
