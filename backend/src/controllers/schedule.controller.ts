import { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";

export class ScheduleController {
  static async getStudentSchedule(req: Request, res: Response) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const schedule = await ScheduleService.getScheduleByEmail(email);
      return res.json(schedule);
    } catch (error: any) {
      console.error("Error fetching student schedule:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to fetch schedule" });
    }
  }
}
