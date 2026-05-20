import { Router } from "express";
import { HomeworkController } from "../controllers/homework.controller";

const router = Router();

/**
 * @route   POST /api/homeworks
 * @desc    Create homework (Professor)
 */
router.post("/", HomeworkController.createHomework);

/**
 * @route   GET /api/homeworks/professor/:id
 * @desc    Get homeworks by professor ID
 */
router.get("/professor/:id", HomeworkController.getHomeworksByProfessor);

/**
 * @route   GET /api/homeworks/student/:email
 * @desc    Get all homeworks for student's enrolled subjects
 */
router.get("/student/:email", HomeworkController.getHomeworksByStudent);

/**
 * @route   GET /api/homeworks/stats/:email
 * @desc    Get homework stats for student (total, thisWeek, avgEcts)
 */
router.get("/stats/:email", HomeworkController.getHomeworkStats);

export default router;
