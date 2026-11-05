import { Router } from "express";
import { LectureController } from "../controllers/lecture.controller";
import { requireAuth } from "../middleware/auth";

// Schedule changes are admin-only and verified by JWT role, not by who the client says it is.
const admin = requireAuth("ADMIN");

const router = Router();

/**
 * @route   POST /api/lecture
 * @desc    Create new lecture (Admin)
 * @access  Private only Admin
 */

router.post("/", admin, LectureController.createLecture);

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

/**
 * @route   DELETE /api/lecture/:id
 * @desc    Delete a lecture (Admin)
 * @access  Private (Admin)
 */
/**
 * @route   PATCH /api/lecture/:id
 * @desc    Set type (predavanje/vježbe) and period (startDate–endDate) of a slot
 * @access  Private (Admin)
 */
router.patch("/:id", admin, LectureController.updateLecturePeriod);

router.delete("/:id", admin, LectureController.deleteLecture);

export default router;
