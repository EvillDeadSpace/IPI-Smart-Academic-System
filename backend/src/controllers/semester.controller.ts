import { Request, Response } from "express";
import { SemesterService } from "../services/semester.service";

export class SemesterController {
  /** GET /api/semester/current — public, za mobilnu app */
  static async getCurrent(req: Request, res: Response) {
    try {
      const semester = await SemesterService.getCurrent();
      return res.json(semester);
    } catch (error) {
      console.error("getCurrent semester error:", error);
      return res.status(500).json({ error: "Greška pri dohvatanju semestra" });
    }
  }

  /** GET /api/semester */
  static async getAll(req: Request, res: Response) {
    try {
      const semesters = await SemesterService.getAll();
      return res.json(semesters);
    } catch (error) {
      console.error("getAll semesters error:", error);
      return res.status(500).json({ error: "Greška pri dohvatanju semestara" });
    }
  }

  /** POST /api/semester */
  static async create(req: Request, res: Response) {
    try {
const { year, type, startDate, endDate } = req.body;
      if (!year || !type || !startDate || !endDate) {
        return res.status(400).json({ error: "Sva polja su obavezna" });
      }
      if (type !== "WINTER" && type !== "SUMMER") {
        return res.status(400).json({ error: "type mora biti WINTER ili SUMMER" });
      }
      const semester = await SemesterService.create({
        year,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
      return res.status(201).json(semester);
    } catch (error: any) {
      console.error("create semester error:", error);
      return res.status(400).json({ error: error.message || "Greška pri kreiranju" });
    }
  }

  /** PUT /api/semester/:id */
  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { year, type, startDate, endDate } = req.body;
      if (type && type !== "WINTER" && type !== "SUMMER") {
        return res.status(400).json({ error: "type mora biti WINTER ili SUMMER" });
      }
      const semester = await SemesterService.update(id, {
        year,
        type,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });
      return res.json(semester);
    } catch (error: any) {
      console.error("update semester error:", error);
      return res.status(400).json({ error: error.message || "Greška pri ažuriranju" });
    }
  }

  /** DELETE /api/semester/:id */
  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await SemesterService.delete(id);
      return res.json({ message: "Semestar obrisan" });
    } catch (error: any) {
      console.error("delete semester error:", error);
      return res.status(400).json({ error: error.message || "Greška pri brisanju" });
    }
  }

  /** PATCH /api/semester/:id/activate */
  static async activate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await SemesterService.activate(id);
      return res.json({ message: "Semestar aktiviran" });
    } catch (error: any) {
      console.error("activate semester error:", error);
      return res.status(400).json({ error: error.message || "Greška pri aktiviranju" });
    }
  }
}
