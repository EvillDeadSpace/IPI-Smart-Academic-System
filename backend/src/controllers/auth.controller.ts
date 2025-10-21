import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ResponseUtil } from "../utils/response";
import {
  LoginRequest,
  RegisterStudentRequest,
  RegisterProfessorRequest,
} from "../types/auth.types";

export class AuthController {
  /**
   * POST /api/auth/login
   * Login for both students and professors
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as LoginRequest;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      // Attempt login
      const user = await AuthService.login({ email, password });

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Return in OLD format for frontend compatibility
      const response: any = {
        message: "Success",
        userEmail: user.email,
        StudentName:
          user.userType === "PROFESSOR"
            ? `${(user as any).title || "Prof"} ${user.firstName} ${
                user.lastName
              }`
            : `${user.firstName} ${user.lastName}`,
        TipUsera: user.userType,
      };

      // Add professor-specific fields
      if (user.userType === "PROFESSOR" && (user as any).subjects) {
        response.professorId = user.id;
        response.subjects = (user as any).subjects;
      }

      return res.json(response);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Login failed" });
    }
  }

  /**
   * POST /api/auth/register/student
   * Register new student
   */
  static async registerStudent(req: Request, res: Response) {
    try {
      const data = req.body as RegisterStudentRequest;

      // Validation
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        return ResponseUtil.validationError(res, "Missing required fields");
      }

      // Check if email already exists
      const emailExists = await AuthService.emailExists(data.email);
      if (emailExists) {
        return ResponseUtil.validationError(res, "Email already registered");
      }

      // Create student
      const student = await AuthService.registerStudent(data);

      return ResponseUtil.success(
        res,
        student,
        "Student registered successfully",
        201
      );
    } catch (error) {
      console.error("Register student error:", error);
      return ResponseUtil.error(res, "Registration failed");
    }
  }

  /**
   * POST /api/auth/register/professor
   * Register new professor
   */
  static async registerProfessor(req: Request, res: Response) {
    try {
      const data = req.body as RegisterProfessorRequest;

      // Validation
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        return ResponseUtil.validationError(res, "Missing required fields");
      }

      // Check if email already exists
      const emailExists = await AuthService.emailExists(data.email);
      if (emailExists) {
        return ResponseUtil.validationError(res, "Email already registered");
      }

      // Create professor
      const professor = await AuthService.registerProfessor(data);

      return ResponseUtil.success(
        res,
        professor,
        "Professor registered successfully",
        201
      );
    } catch (error) {
      console.error("Register professor error:", error);
      return ResponseUtil.error(res, "Registration failed");
    }
  }
}
