import { Router } from "express";
import { StudentController } from "../controllers/student.controller";

const router = Router();

/**
 * @route   GET /api/students
 * @desc    Get all students
 * @access  Private (Admin/Professor)
 */
router.get("/", StudentController.getAllStudents);

/**
 * @route   GET /api/students/:id
 * @desc    Get student by ID
 * @access  Private
 */
router.get("/:id", StudentController.getStudentById);

/**
 * @route   GET /api/students/email/:email
 * @desc    Get student by email
 * @access  Private
 */
router.get("/email/:email", StudentController.getStudentByEmail);

/**
 * @route   GET /api/students/progress/:email
 * @desc    Get student academic progress
 * @access  Private
 */
router.get("/progress/:email", StudentController.getStudentProgress);

/**
 * @route   GET /api/students/grades/:email
 * @desc    Get student grades
 * @access  Private
 */
router.get("/grades/:email", StudentController.getStudentGrades);

/**
 * @route   PUT /api/students/:id
 * @desc    Update student
 * @access  Private (Admin only)
 */
router.put("/:id", StudentController.updateStudent);

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student
 * @access  Private (Admin only)
 */
router.delete("/:id", StudentController.deleteStudent);

export default router;
