import prisma from "../config/database";
import {
  LoginRequest,
  LoginResponse,
  RegisterStudentRequest,
  RegisterProfessorRequest,
} from "../types/auth.types";

export class AuthService {
  /**
   * Login - Check both Student and Professor tables, plus hardcoded Admin
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse | null> {
    const { email, password } = credentials;

    // Check for hardcoded Admin credentials
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return {
        id: 0, // Special ID for admin
        firstName: "System",
        lastName: "Administrator",
        email: ADMIN_EMAIL,
        userType: "ADMIN",
      };
    }

    // Try Student first
    const student = await prisma.student.findFirst({
      where: { email, password },
      include: { major: true },
    });

    if (student) {
      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        userType: "STUDENT",
        major: {
          id: student.major.id,
          name: student.major.name,
          code: student.major.code,
        },
      };
    }

    // Try Professor
    const professor = await prisma.professor.findFirst({
      where: { email, password },
      include: {
        subjects: {
          include: { subject: true },
        },
      },
    });

    if (professor) {
      return {
        id: professor.id,
        firstName: professor.firstName,
        lastName: professor.lastName,
        email: professor.email,
        userType: "PROFESSOR",
        subjects: professor.subjects.map((ps) => ({
          id: ps.subject.id,
          name: ps.subject.name,
          code: ps.subject.code,
        })),
      };
    }

    return null; // Not found
  }

  /**
   * Register new student
   */
  static async registerStudent(data: RegisterStudentRequest) {
    const student = await prisma.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        indexNumber: data.indexNumber,
        dateOfBirth: new Date(data.dateOfBirth),
        major: { connect: { id: data.majorId } },
      },
      include: { major: true },
    });

    return student;
  }

  /**
   * Register new professor
   */
  static async registerProfessor(data: RegisterProfessorRequest) {
    const professor = await prisma.professor.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        // Prisma schema requires `title` (non-nullable). Provide a sensible default.
        title: data.title ?? "Prof",
        // `office` is optional in the schema; normalize undefined -> null.
        office: data.office ?? null,
        subjects: data.subjectIds
          ? {
              create: data.subjectIds.map((subjectId) => ({
                subject: { connect: { id: subjectId } },
              })),
            }
          : undefined,
      },
      include: {
        subjects: {
          include: { subject: true },
        },
      },
    });

    return professor;
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    const student = await prisma.student.findUnique({ where: { email } });
    if (student) return true;

    const professor = await prisma.professor.findUnique({ where: { email } });
    return !!professor;
  }
}
