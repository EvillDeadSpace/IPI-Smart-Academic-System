import { Router } from "express";
import { ExamController } from "../controllers/exam.controller";

const router = Router();

/**
 * @route   POST /api/exams
 * @desc    Create new exam (Professor)
 * @access  Private (Professor)
 */
router.post("/", ExamController.createExam);

/**
 * @route   GET /api/exams/professor/:id
 * @desc    Get exams created by professor
 * @access  Private (Professor)
 */
router.get("/professor/:id", ExamController.getExamsByProfessor);

/**
 * @route   GET /api/exams/student/:email
 * @desc    Get upcoming exams for student
 * @access  Private (Student)
 */
router.get("/student/:email", ExamController.getExamsByStudent);

/**
 * @route   GET /api/exams/available/:email
 * @desc    Get available exams for student (not registered)
 * @access  Private (Student)
 */
router.get("/available/:email", ExamController.getAvailableExams);

/**
 * @route   GET /api/exams/registered/:email
 * @desc    Get registered exams for student
 * @access  Private (Student)
 */
router.get("/registered/:email", ExamController.getRegisteredExams);

/**
 * @route   GET /api/exams/completed/:email
 * @desc    Get completed exams for student (with grades)
 * @access  Private (Student)
 */
router.get("/completed/:email", ExamController.getCompletedExams);

/**
 * @route   POST /api/exams/:id/register
 * @desc    Student registers for exam
 * @access  Private (Student)
 */
router.post("/:id/register", ExamController.registerForExam);

/**
 * @route   DELETE /api/exams/registration/:registrationId
 * @desc    Student unregisters from exam
 * @access  Private (Student)
 */
router.delete(
  "/registration/:registrationId",
  ExamController.unregisterFromExam
);

/**
 * @route   GET /api/exams/:id
 * @desc    Get exam details
 * @access  Private
 */
router.get("/:id", ExamController.getExamById);

/**
 * @route   DELETE /api/exams/:id
 * @desc    Delete exam
 * @access  Private (Professor/Admin)
 */
router.delete("/:id", ExamController.deleteExam);

export default router;
