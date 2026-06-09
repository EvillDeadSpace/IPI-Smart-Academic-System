import { Router } from "express";
import { AssignmentController } from "../controllers/assignment.controller";
import { QuestionController } from "../controllers/question.controller";

const router = Router();

router.post("/", AssignmentController.createAssignment);
router.get("/professor/:id", AssignmentController.getAssignmentsByProfessor);
router.get("/student/:email", AssignmentController.getAssignmentsByStudent);
router.post("/:id/submit", AssignmentController.submitAssignment);
router.post("/:id/grade", AssignmentController.gradeSubmission);
router.get("/progress/:email", AssignmentController.getAssignmentProgress);
router.get("/:id/questions", QuestionController.getQuestion);
router.post("/:id/questions", QuestionController.createQuestion);
router.patch("/:id/questions/:questionId", QuestionController.answerQuestion);

export default router;
