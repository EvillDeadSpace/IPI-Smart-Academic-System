import { Router } from "express";
import { GradeController } from "../controllers/grade.controller";

const router = Router();

/**
 * @route   POST /api/grades
 * @desc    Create new grade for student
 * @access  Private (Professor)
 */
router.post("/", GradeController.createGrade);

/**
 * @route   GET /api/grades/student/:studentId
 * @desc    Get all grades for student
 * @access  Private (Student/Professor)
 */
router.get("/student/:studentId", GradeController.getStudentGrades);

/**
 * @route   GET /api/grades/subject/:subjectId
 * @desc    Get all grades for subject
 * @access  Private (Professor)
 */
router.get("/subject/:subjectId", GradeController.getSubjectGrades);

/**
 * @route   PUT /api/grades/:id
 * @desc    Update grade
 * @access  Private (Professor)
 */
router.put("/:id", GradeController.updateGrade);

/**
 * @route   DELETE /api/grades/:id
 * @desc    Delete grade
 * @access  Private (Professor/Admin)
 */
router.delete("/:id", GradeController.deleteGrade);

export default router;
