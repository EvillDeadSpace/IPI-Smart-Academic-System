import { Router } from "express";
import { AssignmentController } from "../controllers/assignment.controller";

const router = Router();

router.post("/", AssignmentController.createAssignment);
router.get("/professor/:id", AssignmentController.getAssignmentsByProfessor);
router.get("/student/:email", AssignmentController.getAssignmentsByStudent);
router.post("/:id/submit", AssignmentController.submitAssignment);
router.post("/:id/grade", AssignmentController.gradeSubmission);
router.get("/progress/:email", AssignmentController.getAssignmentProgress);

export default router;
