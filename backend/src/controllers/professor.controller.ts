import { Request, Response } from "express";
import { ProfessorService } from "../services/professor.service";

export class ProfessorController {
  /**
   * GET /api/professors
   */
  static async getAllProfessors(_req: Request, res: Response) {
    try {
      const professors = await ProfessorService.getAllProfessors();
      return res.json(professors);
    } catch (error) {
      console.error("Get professors error:", error);
      return res.status(500).json({ error: "Failed to fetch professors" });
    }
  }

  /**
   * GET /api/professors/:id
   */
  static async getProfessorById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const professor = await ProfessorService.getProfessorById(id);

      if (!professor) {
        return res.status(404).json({ error: "Professor not found" });
      }

      return res.json(professor);
    } catch (error) {
      console.error("Get professor error:", error);
      return res.status(500).json({ error: "Failed to fetch professor" });
    }
  }

  /**
   * GET /api/professors/email/:email
   */
  static async getProfessorByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const professor = await ProfessorService.getProfessorByEmail(email);

      if (!professor) {
        return res.status(404).json({ error: "Professor not found" });
      }

      return res.json(professor);
    } catch (error) {
      console.error("Get professor error:", error);
      return res.status(500).json({ error: "Failed to fetch professor" });
    }
  }

  /**
   * POST /api/professors
   */
  static async createProfessor(req: Request, res: Response) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        title,
        office,
        subjectIds,
      } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const professor = await ProfessorService.createProfessor({
        firstName,
        lastName,
        email,
        password,
        title,
        office,
        subjectIds,
      });

      return res.json(professor);
    } catch (error: any) {
      console.error("Create professor error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to create professor" });
    }
  }

  /**
   * PUT /api/professors/:id/subjects
   */
  static async updateProfessorSubjects(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { subjectIds } = req.body;

      if (!subjectIds || !Array.isArray(subjectIds)) {
        return res.status(400).json({ error: "Invalid subjectIds" });
      }

      const professor = await ProfessorService.updateProfessorSubjects(
        id,
        subjectIds
      );
      return res.json(professor);
    } catch (error: any) {
      console.error("Update professor subjects error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to update subjects" });
    }
  }

  /**
   * DELETE /api/professors/:id
   */
  static async deleteProfessor(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await ProfessorService.deleteProfessor(id);
      return res.json({ message: "Professor deleted successfully" });
    } catch (error: any) {
      console.error("Delete professor error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to delete professor" });
    }
  }
}
