import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

/**
 * @route   GET /user/:email
 * @desc    Get user details by email (student or professor)
 * @access  Private
 */
router.get("/:email", UserController.getUserByEmail);

export default router;
