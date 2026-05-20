import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { EnrollmentController } from "../controllers/enrollment.controller";
import { GradeController } from "../controllers/grade.controller";
import { StudentController } from "../controllers/student.controller";
import authRoutes from "./auth.routes";
import documentRequestRoutes from "./document-request.routes";
import enrollmentRoutes from "./enrollment.routes";
import examRoutes from "./exam.routes";
import gradeRoutes from "./grade.routes";
import homeworkRoutes from "./homework.routes";
import lectureRoutes from "./lecture.routes";
import newsRoutes from "./news.route";
import professorRoutes from "./professor.routes";
import scheduleRoutes from "./schedule.routes";
import studentRoutes from "./student.routes";
import userRoutes from "./user.routes";

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
router.use("/news", newsRoutes);
router.use("/schedule", scheduleRoutes);
router.use("/user", userRoutes);
router.use("/lecture", lectureRoutes);
router.use("/homeworks", homeworkRoutes);
router.use("/progress", studentRoutes);

export default router;
