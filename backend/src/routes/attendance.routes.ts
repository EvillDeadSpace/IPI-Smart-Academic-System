import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { requireAuth } from "../middleware/auth";

// Every route takes the user from the verified JWT (res.locals.user), never from the
// body or URL — otherwise anyone could act as any professor or student.
const router = Router();

const professor = requireAuth("PROFESSOR");
const student = requireAuth("STUDENT");

/**
 * @route   POST /api/attendance/sessions   { lectureId }
 * @desc    Open (or resume) an attendance session. Returns the QR secret.
 * @access  Professor who owns the lecture
 */
router.post("/sessions", professor, AttendanceController.openSession);

/**
 * @route   GET /api/attendance/sessions/:id
 * @desc    Session status + live present count
 * @access  Professor who owns the lecture
 */
router.get("/sessions/:id", professor, AttendanceController.getSessionStatus);

/**
 * @route   POST /api/attendance/sessions/:id/close
 * @desc    Close the session; further scans are rejected
 * @access  Professor who owns the lecture
 */
router.post("/sessions/:id/close", professor, AttendanceController.closeSession);

/**
 * @route   GET /api/attendance/professor/lectures
 * @desc    The signed-in professor's lectures with their open session, if any
 * @access  Professor
 */
router.get("/professor/lectures", professor, AttendanceController.getProfessorLectures);

/**
 * @route   GET /api/attendance/active
 * @desc    Open session for one of the signed-in student's subjects
 * @access  Student
 */
router.get("/active", student, AttendanceController.getActiveSession);

/**
 * @route   POST /api/attendance/scan   { payload }
 * @desc    Record attendance for the signed-in student
 * @access  Student
 */
router.post("/scan", student, AttendanceController.scan);

/**
 * @route   GET /api/attendance/student/me
 * @desc    Per-subject attendance summary for the signed-in student
 * @access  Student
 */
router.get("/student/me", student, AttendanceController.getStudentSummary);

export default router;
