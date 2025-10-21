import { Request, Response } from "express";
import { EnrollmentService } from "../services/enrollment.service";

export class EnrollmentController {
  /**
   * GET /api/enrollment/majors/with-subjects
   * Get all majors with subjects
   */
  static async getMajorsWithSubjects(_req: Request, res: Response) {
    try {
      const majors = await EnrollmentService.getMajorsWithSubjects();
      return res.json(majors);
    } catch (error) {
      console.error("Get majors error:", error);
      return res.status(500).json({ error: "Failed to fetch majors" });
    }
  }

  /**
   * POST /api/enrollment/enroll
   * Enroll student in year with subjects
   */
  static async enrollStudent(req: Request, res: Response) {
    try {
      const { email, majorName, year, subjects } = req.body;

      if (!email || !majorName || !year || !subjects || subjects.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await EnrollmentService.enrollStudent({
        email,
        majorName,
        year,
        subjects,
      });

      return res.json(result);
    } catch (error: any) {
      console.error("Enrollment error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Enrollment failed" });
    }
  }

  /**
   * GET /api/enrollment/student/:email
   * Get student enrollments
   */
  static async getStudentEnrollments(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const enrollments = await EnrollmentService.getStudentEnrollments(email);

      if (!enrollments) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.json(enrollments);
    } catch (error) {
      console.error("Get enrollments error:", error);
      return res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  }

  /**
   * DELETE /api/enrollment/:id
   * Delete enrollment
   */
  static async deleteEnrollment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await EnrollmentService.deleteEnrollment(id);
      return res.json({ message: "Enrollment deleted successfully" });
    } catch (error) {
      console.error("Delete enrollment error:", error);
      return res.status(500).json({ error: "Failed to delete enrollment" });
    }
  }
}
