import { Request, Response } from "express";
import { AttendanceError, AttendanceService } from "../services/attendance.service";

// Errors carry a stable `code` so clients can show their own (localized) message.
function handleError(res: Response, error: unknown, fallback: string) {
  if (error instanceof AttendanceError) {
    return res.status(error.status).json({ error: error.message, code: error.code });
  }
  console.error(fallback, error);
  return res.status(500).json({ error: fallback });
}

const parseId = (value: unknown) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export class AttendanceController {
  // POST /api/attendance/sessions  { lectureId, professorEmail }
  static async openSession(req: Request, res: Response) {
    const lectureId = parseId(req.body?.lectureId);
    const { professorEmail } = req.body ?? {};
    if (!lectureId || !professorEmail) {
      return res.status(400).json({ error: "lectureId and professorEmail are required" });
    }
    try {
      return res.status(201).json(await AttendanceService.openSession(professorEmail, lectureId));
    } catch (error) {
      return handleError(res, error, "Failed to open attendance session");
    }
  }

  // GET /api/attendance/sessions/:id
  static async getSessionStatus(req: Request, res: Response) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid session ID" });
    try {
      return res.json(await AttendanceService.getSessionStatus(id));
    } catch (error) {
      return handleError(res, error, "Failed to fetch attendance session");
    }
  }

  // POST /api/attendance/sessions/:id/close  { professorEmail }
  static async closeSession(req: Request, res: Response) {
    const id = parseId(req.params.id);
    const { professorEmail } = req.body ?? {};
    if (!id || !professorEmail) {
      return res.status(400).json({ error: "Valid session ID and professorEmail are required" });
    }
    try {
      return res.json(await AttendanceService.closeSession(id, professorEmail));
    } catch (error) {
      return handleError(res, error, "Failed to close attendance session");
    }
  }

  // GET /api/attendance/professor/:email/lectures
  static async getProfessorLectures(req: Request, res: Response) {
    try {
      return res.json(await AttendanceService.getProfessorLectures(req.params.email));
    } catch (error) {
      return handleError(res, error, "Failed to fetch professor lectures");
    }
  }

  // GET /api/attendance/active/:email
  static async getActiveSession(req: Request, res: Response) {
    try {
      const session = await AttendanceService.getActiveSessionForStudent(req.params.email);
      return res.json({ session });
    } catch (error) {
      return handleError(res, error, "Failed to fetch active attendance session");
    }
  }

  // POST /api/attendance/scan  { email, payload }
  static async scan(req: Request, res: Response) {
    const { email, payload } = req.body ?? {};
    if (typeof email !== "string" || typeof payload !== "string") {
      return res.status(400).json({ error: "email and payload are required" });
    }
    try {
      return res.json(await AttendanceService.scan(email, payload));
    } catch (error) {
      return handleError(res, error, "Failed to record attendance");
    }
  }

  // GET /api/attendance/student/:email
  static async getStudentSummary(req: Request, res: Response) {
    try {
      return res.json(await AttendanceService.getStudentSummary(req.params.email));
    } catch (error) {
      return handleError(res, error, "Failed to fetch attendance summary");
    }
  }
}
