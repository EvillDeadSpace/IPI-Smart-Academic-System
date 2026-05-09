import { Request, Response } from "express";
import { LectureService } from "../services/lecture.service";

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

      if (dayOfWeek < 0 || dayOfWeek > 4) {
        return res.status(400).json({ error: "dayOfWeek must be 0 (Monday) to 4 (Friday)" });
      }

      const lecture = await LectureService.createLecture({
        subjectId: Number(subjectId),
        professorId: Number(professorId),
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endOfTime: endTime,
        room,
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
}
