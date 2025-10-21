import { Request, Response } from "express";
import { ExamService } from "../services/exam.service";

export class ExamController {
  /**
   * POST /api/exams
   */
  static async createExam(req: Request, res: Response) {
    try {
      const { subjectId, professorId, examTime, location, maxPoints } =
        req.body;

      if (!subjectId || !professorId || !examTime) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const exam = await ExamService.createExam({
        subjectId: Number(subjectId),
        professorId: Number(professorId),
        examTime,
        location,
        maxPoints,
      });

      return res.json({ message: "Exam created", exam });
    } catch (error: any) {
      console.error("Create exam error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to create exam" });
    }
  }

  /**
   * GET /api/exams/professor/:id
   */
  static async getExamsByProfessor(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const exams = await ExamService.getExamsByProfessor(id);
      return res.json(exams);
    } catch (error) {
      console.error("Get exams error:", error);
      return res.status(500).json({ error: "Failed to fetch exams" });
    }
  }

  /**
   * GET /api/exams/student/:email
   */
  static async getExamsByStudent(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const exams = await ExamService.getExamsByStudent(email);

      if (exams === null) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.json(exams);
    } catch (error) {
      console.error("Get student exams error:", error);
      return res.status(500).json({ error: "Failed to fetch student exams" });
    }
  }

  /**
   * GET /api/exams/:id
   */
  static async getExamById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const exam = await ExamService.getExamById(id);

      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }

      return res.json(exam);
    } catch (error) {
      console.error("Get exam error:", error);
      return res.status(500).json({ error: "Failed to fetch exam" });
    }
  }

  /**
   * POST /api/exams/:id/register
   */
  static async registerForExam(req: Request, res: Response) {
    try {
      const examId = parseInt(req.params.id);
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Student email required" });
      }

      const registration = await ExamService.registerForExam(examId, email);
      return res.json({ message: "Registered successfully", registration });
    } catch (error: any) {
      console.error("Register exam error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to register" });
    }
  }

  /**
   * DELETE /api/exams/:id
   */
  static async deleteExam(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await ExamService.deleteExam(id);
      return res.json({ message: "Exam deleted successfully" });
    } catch (error: any) {
      console.error("Delete exam error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to delete exam" });
    }
  }
}
