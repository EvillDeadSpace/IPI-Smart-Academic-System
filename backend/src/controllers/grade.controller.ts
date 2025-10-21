import { Request, Response } from "express";
import { GradeService } from "../services/grade.service";

export class GradeController {
  /**
   * POST /api/grades
   */
  static async createGrade(req: Request, res: Response) {
    try {
      const {
        studentId,
        studentEmail,
        subjectId,
        grade,
        points,
        examType,
        academicYear,
      } = req.body;

      if ((!studentId && !studentEmail) || !subjectId || grade === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const createdGrade = await GradeService.createGrade({
        studentId: studentId ? Number(studentId) : undefined,
        studentEmail,
        subjectId: Number(subjectId),
        grade: Number(grade),
        points: points ? Number(points) : undefined,
        examType,
        academicYear,
      });

      return res.json({ message: "Grade created", grade: createdGrade });
    } catch (error: any) {
      console.error("Create grade error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to create grade" });
    }
  }

  /**
   * GET /api/grades/student/:studentId
   */
  static async getStudentGrades(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const grades = await GradeService.getStudentGrades(Number(studentId));

      if (grades === null) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.json(grades);
    } catch (error) {
      console.error("Get student grades error:", error);
      return res.status(500).json({ error: "Failed to fetch grades" });
    }
  }

  /**
   * GET /api/grades/subject/:subjectId
   */
  static async getSubjectGrades(req: Request, res: Response) {
    try {
      const { subjectId } = req.params;
      const grades = await GradeService.getSubjectGrades(Number(subjectId));
      return res.json(grades);
    } catch (error) {
      console.error("Get subject grades error:", error);
      return res.status(500).json({ error: "Failed to fetch grades" });
    }
  }

  /**
   * PUT /api/grades/:id
   */
  static async updateGrade(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { grade, points, examType } = req.body;

      const updated = await GradeService.updateGrade(id, {
        grade: grade ? Number(grade) : undefined,
        points: points ? Number(points) : undefined,
        examType,
      });

      return res.json({ message: "Grade updated", grade: updated });
    } catch (error: any) {
      console.error("Update grade error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to update grade" });
    }
  }

  /**
   * DELETE /api/grades/:id
   */
  static async deleteGrade(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await GradeService.deleteGrade(id);
      return res.json({ message: "Grade deleted successfully" });
    } catch (error: any) {
      console.error("Delete grade error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to delete grade" });
    }
  }
}
