import { Router } from "express";
import { ProfessorController } from "../controllers/professor.controller";

const router = Router();

/**
 * @route   GET /api/professors
 * @desc    Get all professors
 * @access  Public
 */
router.get("/", ProfessorController.getAllProfessors);

/**
 * @route   POST /api/professors
 * @desc    Create new professor
 * @access  Private (Admin)
 */
router.post("/", ProfessorController.createProfessor);

/**
 * @route   GET /api/professors/:id
 * @desc    Get professor by ID
 * @access  Public
 */
router.get("/:id", ProfessorController.getProfessorById);

/**
 * @route   GET /api/professors/email/:email
 * @desc    Get professor by email
 * @access  Public
 */
router.get("/email/:email", ProfessorController.getProfessorByEmail);

/**
 * @route   PUT /api/professors/:id/subjects
 * @desc    Update professor's subjects
 * @access  Private (Admin)
 */
router.put("/:id/subjects", ProfessorController.updateProfessorSubjects);

/**
 * @route   DELETE /api/professors/:id
 * @desc    Delete professor
 * @access  Private (Admin)
 */
router.delete("/:id", ProfessorController.deleteProfessor);

export default router;
