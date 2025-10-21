import { Request, Response } from "express";
import { StudentService } from "../services/student.service";
import { ResponseUtil } from "../utils/response";

export class StudentController {
  /**
   * GET /api/students
   * Get all students
   */
  static async getAllStudents(_req: Request, res: Response) {
    try {
      const students = await StudentService.getAllStudents();
      return ResponseUtil.success(res, students);
    } catch (error) {
      console.error("Get students error:", error);
      return ResponseUtil.error(res, "Failed to fetch students");
    }
  }

  /**
   * GET /api/students/:id
   * Get student by ID
   */
  static async getStudentById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const student = await StudentService.getStudentById(id);

      if (!student) {
        return ResponseUtil.notFound(res, "Student");
      }

      return ResponseUtil.success(res, student);
    } catch (error) {
      console.error("Get student error:", error);
      return ResponseUtil.error(res, "Failed to fetch student");
    }
  }

  /**
   * GET /api/students/email/:email
   * Get student by email
   */
  static async getStudentByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const student = await StudentService.getStudentByEmail(email);

      if (!student) {
        return ResponseUtil.notFound(res, "Student");
      }

      return ResponseUtil.success(res, student);
    } catch (error) {
      console.error("Get student error:", error);
      return ResponseUtil.error(res, "Failed to fetch student");
    }
  }

  /**
   * GET /api/students/progress/:email
   * Get student progress
   */
  static async getStudentProgress(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const progress = await StudentService.getStudentProgress(email);

      if (!progress) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Return raw data for frontend compatibility (no wrapper)
      return res.json(progress);
    } catch (error) {
      console.error("Get progress error:", error);
      return res.status(500).json({ error: "Failed to fetch progress" });
    }
  }

  /**
   * GET /api/students/grades/:email
   * Get student grades
   */
  static async getStudentGrades(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const grades = await StudentService.getStudentGrades(email);

      if (grades === null) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Return raw array for frontend compatibility (no wrapper)
      return res.json(grades);
    } catch (error) {
      console.error("Get grades error:", error);
      return res.status(500).json({ error: "Failed to fetch grades" });
    }
  }

  /**
   * PUT /api/students/:id
   * Update student
   */
  static async updateStudent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;

      const student = await StudentService.updateStudent(id, data);
      return ResponseUtil.success(res, student, "Student updated successfully");
    } catch (error) {
      console.error("Update student error:", error);
      return ResponseUtil.error(res, "Failed to update student");
    }
  }

  /**
   * DELETE /api/students/:id
   * Delete student
   */
  static async deleteStudent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await StudentService.deleteStudent(id);

      return ResponseUtil.success(res, null, "Student deleted successfully");
    } catch (error) {
      console.error("Delete student error:", error);
      return ResponseUtil.error(res, "Failed to delete student");
    }
  }
}
