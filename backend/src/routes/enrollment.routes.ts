import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollment.controller";

const router = Router();

/**
 * @route   GET /api/enrollment/majors/with-subjects
 * @desc    Get all majors with subjects grouped by year
 * @access  Public
 */
router.get("/majors/with-subjects", EnrollmentController.getMajorsWithSubjects);

/**
 * @route   POST /api/enrollment/enroll
 * @desc    Enroll student in year with subjects
 * @access  Private (Student)
 */
router.post("/enroll", EnrollmentController.enrollStudent);

/**
 * @route   GET /api/enrollment/student/:email
 * @desc    Get student enrollments
 * @access  Private (Student)
 */
router.get("/student/:email", EnrollmentController.getStudentEnrollments);

/**
 * @route   DELETE /api/enrollment/:id
 * @desc    Delete enrollment
 * @access  Private (Admin)
 */
router.delete("/:id", EnrollmentController.deleteEnrollment);

export default router;
