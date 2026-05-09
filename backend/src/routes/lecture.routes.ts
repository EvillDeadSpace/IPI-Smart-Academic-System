import { Router } from "express";
import { LectureController } from "../controllers/lecture.controller";

const router = Router();

/**
 * @route   POST /api/lecture
 * @desc    Create new lecture (Admin)
 * @access  Private only Admin
 */

router.post("/", LectureController.createLecture);

/**
 * @route   GET /api/lecture
 * @desc    Get all lecture (Admin)
 * @access  Private only Admin
 */

// For admin to fetch all lecture
router.get("/", LectureController.getAllLectures);

/**
 * @route   GET /api/next/:email
 * @desc    Get next lecture for student
 * @access  Privet only Student
 */

router.get("/next/:email", LectureController.getNextLecture);

/**
 * @route   GET /api/lectures/student/:email
 * @desc    Get full weekly schedule for student
 * @access  Private (Student)
 */
router.get("/student/:email", LectureController.getLecturesByStudent);

// need implemnet for professor and admin to get lectures by professor and all lectures
export default router;
