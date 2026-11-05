import { Request, Response } from "express";
import { currentUser } from "../middleware/auth";
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

// Identity always comes from currentUser(res) — set by requireAuth from the verified JWT.
export class AttendanceController {
  // POST /api/attendance/sessions  { lectureId }
  static async openSession(req: Request, res: Response) {
    const lectureId = parseId(req.body?.lectureId);
    if (!lectureId) return res.status(400).json({ error: "lectureId is required" });
    try {
      const session = await AttendanceService.openSession(currentUser(res).email, lectureId);
      return res.status(201).json(session);
    } catch (error) {
      return handleError(res, error, "Failed to open attendance session");
    }
  }

  // GET /api/attendance/sessions/:id
  static async getSessionStatus(req: Request, res: Response) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid session ID" });
    try {
      return res.json(await AttendanceService.getSessionStatus(id, currentUser(res).email));
    } catch (error) {
      return handleError(res, error, "Failed to fetch attendance session");
    }
  }

  // POST /api/attendance/sessions/:id/close
  static async closeSession(req: Request, res: Response) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid session ID" });
    try {
      return res.json(await AttendanceService.closeSession(id, currentUser(res).email));
    } catch (error) {
      return handleError(res, error, "Failed to close attendance session");
    }
  }

  // GET /api/attendance/professor/lectures
  static async getProfessorLectures(_req: Request, res: Response) {
    try {
      return res.json(await AttendanceService.getProfessorLectures(currentUser(res).email));
    } catch (error) {
      return handleError(res, error, "Failed to fetch professor lectures");
    }
  }

  // GET /api/attendance/active
  static async getActiveSession(_req: Request, res: Response) {
    try {
      const session = await AttendanceService.getActiveSessionForStudent(currentUser(res).email);
      return res.json({ session });
    } catch (error) {
      return handleError(res, error, "Failed to fetch active attendance session");
    }
  }

  // POST /api/attendance/scan  { payload }
  static async scan(req: Request, res: Response) {
    const { payload } = req.body ?? {};
    if (typeof payload !== "string") return res.status(400).json({ error: "payload is required" });
    try {
      return res.json(await AttendanceService.scan(currentUser(res).email, payload));
    } catch (error) {
      return handleError(res, error, "Failed to record attendance");
    }
  }

  // GET /api/attendance/student/me
  static async getStudentSummary(_req: Request, res: Response) {
    try {
      return res.json(await AttendanceService.getStudentSummary(currentUser(res).email));
    } catch (error) {
      return handleError(res, error, "Failed to fetch attendance summary");
    }
  }
}
