import { Router } from "express";
import authRoutes from "./auth.routes";
import studentRoutes from "./student.routes";
import professorRoutes from "./professor.routes";
import examRoutes from "./exam.routes";
import enrollmentRoutes from "./enrollment.routes";
import gradeRoutes from "./grade.routes";
import documentRequestRoutes from "./document-request.routes";
import { AuthController } from "../controllers/auth.controller";
import { StudentController } from "../controllers/student.controller";
import { EnrollmentController } from "../controllers/enrollment.controller";
import { GradeController } from "../controllers/grade.controller";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({
    status: "OK",
    message: "IPI Smart Academic System API",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// LEGACY ROUTES (for backward compatibility with old frontend)
// ============================================

// Old: POST /api/login → New: POST /api/auth/login
router.post("/login", AuthController.login);

// Old: POST /api/students → New: POST /api/auth/register/student
router.post("/students", AuthController.registerStudent);

// Old: GET /api/student/progress/:email → New: GET /api/students/progress/:email
router.get("/student/progress/:email", StudentController.getStudentProgress);

// Old: GET /api/student/grades/:email → New: GET /api/students/grades/:email
router.get("/student/grades/:email", StudentController.getStudentGrades);

// Old: POST /api/student/enroll → New: POST /api/enrollment/enroll
router.post("/student/enroll", EnrollmentController.enrollStudent);

// Old: GET /api/majors/with-subjects → New: GET /api/enrollment/majors/with-subjects
router.get("/majors/with-subjects", EnrollmentController.getMajorsWithSubjects);

// Old: POST /api/student/grade → New: POST /api/grades
router.post("/student/grade", GradeController.createGrade);

// ============================================
// NEW CLEAN ROUTES
// ============================================

// Mount routes
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/professors", professorRoutes);
router.use("/exams", examRoutes);
router.use("/enrollment", enrollmentRoutes);
router.use("/grades", gradeRoutes);
router.use("/document-requests", documentRequestRoutes);

export default router;
