import { Request, Response } from "express";
import { AssignmentService } from "../services/assignment.service";

export class AssignmentController {
  /**
   * POST /api/assignments
   */
  static async createAssignment(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        type,
        difficulty,
        dueDate,
        maxPoints,
        professorS3Path,
        subjectId,
        professorId,
      } = req.body;

      if (!title || !type || !dueDate || !maxPoints || !subjectId || !professorId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const assignment = await AssignmentService.createAssignment({
        title,
        description,
        type,
        difficulty,
        dueDate,
        maxPoints: Number(maxPoints),
        professorS3Path: professorS3Path || undefined,
        subjectId: Number(subjectId),
        professorId: Number(professorId),
      });

      return res.json({ message: "Assignment created", assignment });
    } catch (error: any) {
      console.error("Create assignment error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to create assignment" });
    }
  }

  /**
   * GET /api/assignments/professor/:id
   */
  static async getAssignmentsByProfessor(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const assignments = await AssignmentService.getAssignmentsByProfessor(id);
      return res.json(assignments);
    } catch (error) {
      console.error("Get assignments error:", error);
      return res.status(500).json({ error: "Failed to fetch assignments" });
    }
  }

  /**
   * GET /api/assignments/student/:email
   */
  static async getAssignmentsByStudent(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const assignments = await AssignmentService.getAssignmentsByStudent(email);

      if (!assignments) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.json(assignments);
    } catch (error) {
      console.error("Get student assignments error:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch student assignments" });
    }
  }

  /**
   * POST /api/assignments/:id/submit
   */
  static async submitAssignment(req: Request, res: Response) {
    try {
      const assignmentId = parseInt(req.params.id);
      const { studentEmail, s3Path } = req.body;

      if (!studentEmail || !s3Path) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const submission = await AssignmentService.submitAssignment(
        assignmentId,
        studentEmail,
        s3Path
      );

      return res.json({ message: "Assignment submitted", submission });
    } catch (error: any) {
      console.error("Submit assignment error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to submit assignment" });
    }
  }

  /**
   * POST /api/assignments/:id/grade
   */
  static async gradeSubmission(req: Request, res: Response) {
    try {
      const assignmentId = parseInt(req.params.id);
      const { studentEmail, pointsEarned, feedback, gradedById } = req.body;

      if (!studentEmail || pointsEarned === undefined || !gradedById) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const submission = await AssignmentService.gradeSubmission(
        assignmentId,
        studentEmail,
        Number(pointsEarned),
        feedback,
        Number(gradedById)
      );

      return res.json({ message: "Submission graded", submission });
    } catch (error: any) {
      console.error("Grade submission error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to grade submission" });
    }
  }

  /**
   * GET /api/assignments/progress/:email
   */
  static async getAssignmentProgress(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const progress =
        await AssignmentService.getAssignmentProgressBySubject(email);

      if (!progress) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.json(progress);
    } catch (error) {
      console.error("Get assignment progress error:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch assignment progress" });
    }
  }
}
