import { Request, Response } from "express";
import { LectureService, LectureType } from "../services/lecture.service";
import { parsePlainDate } from "../utils/lectureCalendar";

const LECTURE_TYPES: LectureType[] = ["LECTURE", "EXERCISE"];

/**
 * Validates type + optional period from a request body.
 * Period is both dates or neither; end must not be before start.
 */
function parsePeriod(
  body: any,
):
  | { ok: true; value: { type: LectureType; startDate: Date | null; endDate: Date | null } }
  | { ok: false; error: string } {
  const type = body?.type ?? "LECTURE";
  if (!LECTURE_TYPES.includes(type)) {
    return { ok: false, error: "type must be LECTURE or EXERCISE" };
  }

  const hasStart = body?.startDate != null && body.startDate !== "";
  const hasEnd = body?.endDate != null && body.endDate !== "";
  if (hasStart !== hasEnd) {
    return { ok: false, error: "startDate and endDate must be set together" };
  }
  if (!hasStart) return { ok: true, value: { type, startDate: null, endDate: null } };

  const startDate = parsePlainDate(body.startDate);
  const endDate = parsePlainDate(body.endDate);
  if (!startDate || !endDate) {
    return { ok: false, error: "startDate and endDate must be dates in YYYY-MM-DD format" };
  }
  if (endDate < startDate) return { ok: false, error: "endDate must not be before startDate" };

  return { ok: true, value: { type, startDate, endDate } };
}

export class LectureController {
  // POST /api/lectures  (admin)
  static async createLecture(req: Request, res: Response) {
    try {
      const { subjectId, professorId, dayOfWeek, startTime, endTime, room } = req.body;

      // Request all field
      if (
        !subjectId ||
        !professorId ||
        dayOfWeek === undefined ||
        !startTime ||
        !endTime ||
        !room
      ) {
        return res.status(400).json({
          error:
            "All fields are required: subjectId, professorId, dayOfWeek, startTime, endTime, room",
        });
      }

      if (dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json({ error: "dayOfWeek must be 0 (Monday) to 6 (Sunday)" });
      }

      const period = parsePeriod(req.body);
      if (!period.ok) return res.status(400).json({ error: period.error });

      const lecture = await LectureService.createLecture({
        subjectId: Number(subjectId),
        professorId: Number(professorId),
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endOfTime: endTime,
        room,
        ...period.value,
      });

      return res.status(201).json(lecture);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to create lecture" });
    }
  }

  // GET /api/lectures  (admin - sva predavanja)
  static async getAllLectures(_req: Request, res: Response) {
    try {
      const lectures = await LectureService.getAllLectures();
      return res.json(lectures);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to fetch lectures" });
    }
  }

  // GET /api/lectures/next/:email  (student - get next lecture)
  static async getNextLecture(req: Request, res: Response) {
    try {
      const { email } = req.params;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const lecture = await LectureService.getNextLecture(email);

      if (!lecture) {
        return res.json({ message: "No upcoming lectures found", lecture: null });
      }

      return res.json(lecture);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to fetch next lecture" });
    }
  }
  // GET /api/lectures/student/:email  (student - cijeli tjedni raspored)
  static async getLecturesByStudent(req: Request, res: Response) {
    try {
      const { email } = req.params;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const lectures = await LectureService.getLecturesByStudent(email);
      return res.json(lectures);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to fetch student lectures" });
    }
  }

  // PATCH /api/lecture/:id  (admin) { type, startDate, endDate }
  static async updateLecturePeriod(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid lecture ID" });
      }
      const period = parsePeriod(req.body);
      if (!period.ok) return res.status(400).json({ error: period.error });

      return res.json(await LectureService.updateLecturePeriod(id, period.value));
    } catch (error: any) {
      const status = error.message === "Lecture not found" ? 404 : 500;
      return res.status(status).json({ error: error.message || "Failed to update lecture" });
    }
  }

  static async deleteLecture(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid lecture ID" });

      const result = await LectureService.deleteLecture(id);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to delete lecture" });
    }
  }
}
