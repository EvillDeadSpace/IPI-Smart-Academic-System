import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login for students and professors
 * @access  Public
 */
router.post("/login", AuthController.login);

/**
 * @route   POST /api/auth/register/student
 * @desc    Register new student
 * @access  Public
 */
router.post("/register/student", AuthController.registerStudent);

/**
 * @route   POST /api/auth/register/professor
 * @desc    Register new professor
 * @access  Public (or Admin only in production)
 */
router.post("/register/professor", AuthController.registerProfessor);

export default router;
