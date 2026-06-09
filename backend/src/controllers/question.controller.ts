import { Request, Response } from "express";
import { QuestionServices } from "../services/question.service";

export class QuestionController {
  /**
   * POST /api/question
   */
  static async createQuestion(req: Request, res: Response) {
    try {
      const assignmentId = parseInt(req.params.id);
      const { studentEmail, text } = req.body;

      if (!assignmentId || !studentEmail || !text) {
        return res.status(400).json("Missing required fields");
      }

      const question = await QuestionServices.createQuestion({ assignmentId, studentEmail, text });
      return res.status(201).json({
        message: "Question created",
        question,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Internal server error" });
    }
  }

  /**
   * GET /api/assignments/:id/questions
   */
  static async getQuestion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const question = await QuestionServices.getQuestion(id);

      return res.status(200).json({ message: "Question found", question });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Internal server error" });
    }
  }
  /**
   * PATCH /api/assignments/:id/questions
   */

  static async answerQuestion(req: Request, res: Response) {
    try {
      const questionId = parseInt(req.params.questionId);

      const { answer } = req.body;

      const answerQuestion = await QuestionServices.answerQuestion({
        questionId,
        answerText: answer,
      });
      return res.status(200).json({ message: "Question answered", answerQuestion });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Internal server error" });
    }
  }
}
