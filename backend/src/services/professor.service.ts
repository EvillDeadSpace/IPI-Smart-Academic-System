import { getPrismaClient } from "../config/database";

const prisma = getPrismaClient();

export class ProfessorService {
  /**
   * Get all professors with their subjects
   */
  static async getAllProfessors() {
    const professors = await prisma.professor.findMany({
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    return professors.map((prof) => ({
      id: prof.id,
      firstName: prof.firstName,
      lastName: prof.lastName,
      email: prof.email,
      title: prof.title,
      office: prof.office,
      subjects: prof.subjects.map((ps) => ({
        id: ps.subject.id,
        name: ps.subject.name,
        code: ps.subject.code,
        ects: ps.subject.ects,
      })),
    }));
  }

  /**
   * Get professor by ID
   */
  static async getProfessorById(id: number) {
    const professor = await prisma.professor.findUnique({
      where: { id },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!professor) {
      return null;
    }

    return {
      id: professor.id,
      firstName: professor.firstName,
      lastName: professor.lastName,
      email: professor.email,
      title: professor.title,
      office: professor.office,
      subjects: professor.subjects.map((ps) => ({
        id: ps.subject.id,
        name: ps.subject.name,
        code: ps.subject.code,
        ects: ps.subject.ects,
      })),
    };
  }

  /**
   * Get professor by email
   */
  static async getProfessorByEmail(email: string) {
    const professor = await prisma.professor.findUnique({
      where: { email },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!professor) {
      return null;
    }

    return {
      id: professor.id,
      firstName: professor.firstName,
      lastName: professor.lastName,
      email: professor.email,
      title: professor.title,
      office: professor.office,
      subjects: professor.subjects.map((ps) => ({
        id: ps.subject.id,
        name: ps.subject.name,
        code: ps.subject.code,
        ects: ps.subject.ects,
      })),
    };
  }

  /**
   * Create new professor
   */
  static async createProfessor(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    title?: string;
    office?: string;
    subjectIds?: number[];
  }) {
    const { firstName, lastName, email, password, title, office, subjectIds } =
      data;

    // Check if email exists
    const existing = await prisma.professor.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error("Professor with this email already exists");
    }

    // Create professor
    const professor = await prisma.professor.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        title: title || "Prof",
        office: office || null,
      },
    });

    // Assign subjects if provided
    if (subjectIds && subjectIds.length > 0) {
      await prisma.professorSubject.createMany({
        data: subjectIds.map((subjectId) => ({
          professorId: professor.id,
          subjectId,
        })),
      });
    }

    // Fetch complete professor with subjects
    return this.getProfessorById(professor.id);
  }

  /**
   * Update professor subjects
   */
  static async updateProfessorSubjects(id: number, subjectIds: number[]) {
    // Check if professor exists
    const professor = await prisma.professor.findUnique({
      where: { id },
    });

    if (!professor) {
      throw new Error("Professor not found");
    }

    // Delete old assignments
    await prisma.professorSubject.deleteMany({
      where: { professorId: id },
    });

    // Create new assignments
    if (subjectIds.length > 0) {
      await prisma.professorSubject.createMany({
        data: subjectIds.map((subjectId) => ({
          professorId: id,
          subjectId,
        })),
      });
    }

    return this.getProfessorById(id);
  }

  /**
   * Delete professor
   */
  static async deleteProfessor(id: number) {
    const professor = await prisma.professor.findUnique({
      where: { id },
    });

    if (!professor) {
      throw new Error("Professor not found");
    }

    await prisma.professor.delete({
      where: { id },
    });
  }
}
