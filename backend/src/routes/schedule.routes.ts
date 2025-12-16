import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";

const router = Router();

router.get("/:email", ScheduleController.getStudentSchedule);

export default router;
