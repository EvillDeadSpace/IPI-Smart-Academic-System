import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";

const router = Router();

/**
 * @route   POST /api/attendance/sessions
 * @desc    Open (or resume) an attendance session for a lecture. Returns the QR secret.
 * @access  Professor (owner of the lecture)
 */
router.post("/sessions", AttendanceController.openSession);

/**
 * @route   GET /api/attendance/sessions/:id
 * @desc    Session status + live present count (polled by the QR page)
 * @access  Professor
 */
router.get("/sessions/:id", AttendanceController.getSessionStatus);

/**
 * @route   POST /api/attendance/sessions/:id/close
 * @desc    Close the session; further scans are rejected
 * @access  Professor (owner of the lecture)
 */
router.post("/sessions/:id/close", AttendanceController.closeSession);

/**
 * @route   GET /api/attendance/professor/:email/lectures
 * @desc    Professor's lectures with their open session, if any
 * @access  Professor
 */
router.get("/professor/:email/lectures", AttendanceController.getProfessorLectures);

/**
 * @route   GET /api/attendance/active/:email
 * @desc    Open session for one of the student's subjects (drives the mobile scan button)
 * @access  Student
 */
router.get("/active/:email", AttendanceController.getActiveSession);

/**
 * @route   POST /api/attendance/scan
 * @desc    Record attendance from a scanned QR payload
 * @access  Student
 */
router.post("/scan", AttendanceController.scan);

/**
 * @route   GET /api/attendance/student/:email
 * @desc    Per-subject attendance summary for the student
 * @access  Student
 */
router.get("/student/:email", AttendanceController.getStudentSummary);

export default router;
