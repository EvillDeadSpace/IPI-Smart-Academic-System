import { Request, Response } from "express";
import prisma from "../config/database";

export class UserController {
  /**
   * @route   GET /user/:email
   * @desc    Get user details by email (works for both students and professors)
   * @access  Private
   */
  static async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      // Try to find student first
      const student = await prisma.student.findUnique({
        where: { email },
        include: {
          major: true,
        },
      });

      if (student) {
        res.status(200).json({
          userType: "STUDENT",
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          indexNumber: student.indexNumber,
          currentYear: student.currentYear,
          status: student.status,
          dateOfBirth: student.dateOfBirth,
          major: student.major,
        });
        return;
      }

      // If not a student, try to find professor
      const professor = await prisma.professor.findUnique({
        where: { email },
      });

      if (professor) {
        res.status(200).json({
          userType: "PROFESOR",
          id: professor.id,
          firstName: professor.firstName,
          lastName: professor.lastName,
          email: professor.email,
          title: professor.title,
          office: professor.office,
        });
        return;
      }

      // User not found
      res.status(404).json({ error: "User not found" });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ error: "Failed to fetch user details" });
    }
  }
}
