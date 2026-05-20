import { Request, Response } from "express";
import { HomeworkService } from "../services/homework.service";

export class HomeworkController {
  /**
   * POST /api/homeworks
   */
  static async createHomework(req: Request, res: Response) {
    try {
      const { title, description, s3Path, dueDate, subjectId, professorId } =
        req.body;

      if (!title || !s3Path || !dueDate || !subjectId || !professorId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const homework = await HomeworkService.createHomework({
        title,
        description,
        s3Path,
        dueDate,
        subjectId: Number(subjectId),
        professorId: Number(professorId),
      });

      return res.json({ message: "Homework created", homework });
    } catch (error: any) {
      console.error("Create homework error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to create homework" });
    }
  }

  /**
   * GET /api/homeworks/professor/:id
   */
  static async getHomeworksByProfessor(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const homeworks = await HomeworkService.getHomeworksByProfessor(id);
      return res.json(homeworks);
    } catch (error) {
      console.error("Get homeworks error:", error);
      return res.status(500).json({ error: "Failed to fetch homeworks" });
    }
  }

  /**
   * GET /api/homeworks/student/:email
   */
  static async getHomeworksByStudent(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const homeworks = await HomeworkService.getHomeworksByStudent(email);

      if (!homeworks) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.json(homeworks);
    } catch (error) {
      console.error("Get student homeworks error:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch student homeworks" });
    }
  }

  /**
   * GET /api/homeworks/stats/:email
   */
  static async getHomeworkStats(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const stats = await HomeworkService.getHomeworkStats(email);

      if (!stats) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.json(stats);
    } catch (error) {
      console.error("Get homework stats error:", error);
      return res.status(500).json({ error: "Failed to fetch homework stats" });
    }
  }
}
