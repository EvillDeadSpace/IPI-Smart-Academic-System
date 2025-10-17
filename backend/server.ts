import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test ruta
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

// Ruta: Dohvati sve studente
app.get("/api/students", async (_req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { major: true },
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
});

// Ruta: Kreiraj studenta
app.post("/api/students", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      indexNumber,
      dateOfBirth,
      majorId,
      password,
    } = req.body;
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        indexNumber,
        dateOfBirth: new Date(dateOfBirth),
        password,
        major: { connect: { id: majorId } },
      },
    });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Create failed" });
  }
});

app.get("/api/login", async (req, res) => {
  const { email, password } = req.query;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }
  try {
    const student = await prisma.student.findFirst({
      where: { email: String(email), password: String(password) },
      include: { major: true },
    });

    if (!student) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// POST login - accept JSON body (email, password)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Missing email or password", receivedBody: req.body });
  }

  try {
    // First check if it's a student
    const student = await prisma.student.findFirst({
      where: { email: String(email), password: String(password) },
      include: { major: true },
    });

    if (student) {
      return res.json({
        message: "Success",
        userEmail: student.email,
        StudentName: `${student.firstName} ${student.lastName}`,
        TipUsera: "STUDENT",
      });
    }

    // Check if it's a professor
    const professor = await prisma.professor.findFirst({
      where: { email: String(email), password: String(password) },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (professor) {
      return res.json({
        message: "Success",
        userEmail: professor.email,
        StudentName: `${professor.title} ${professor.firstName} ${professor.lastName}`,
        TipUsera: "PROFESOR",
        professorId: professor.id,
        subjects: professor.subjects.map((ps) => ({
          id: ps.subject.id,
          name: ps.subject.name,
          code: ps.subject.code,
        })),
      });
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

// ============================================
// ENROLLMENT ENDPOINTS (Upis na godinu)
// ============================================

// GET /api/majors/with-subjects - Returns all majors with their subjects grouped by year
app.get("/api/majors/with-subjects", async (_req, res) => {
  try {
    const majors = await prisma.major.findMany({
      include: {
        subjects: {
          orderBy: [{ yearPlan: { year: "asc" } }, { isElective: "asc" }],
          include: {
            yearPlan: true,
          },
        },
      },
    });

    // Transform to cleaner structure for frontend
    const formatted = majors.map((major) => ({
      id: major.id,
      name: major.name,
      code: major.code,
      description: major.description,
      duration: major.duration,
      subjects: major.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        ects: s.ects,
        isElective: s.isElective,
        year: s.yearPlan.year,
        semester: s.yearPlan.semester,
      })),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching majors:", err);
    res.status(500).json({ error: "Failed to fetch majors" });
  }
});

// POST /api/student/enroll - Enroll student in a year with subjects
app.post("/api/student/enroll", async (req, res) => {
  try {
    const { email, majorName, year, subjects } = req.body;

    if (!email || !majorName || !year || !subjects || subjects.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email },
      include: { major: true, yearEnrollments: true },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find major by name
    const major = await prisma.major.findUnique({
      where: { name: majorName },
    });

    if (!major) {
      return res.status(404).json({ error: "Major not found" });
    }

    // Check if student already enrolled in this year
    const academicYear = `${new Date().getFullYear()}/${
      new Date().getFullYear() + 1
    }`;
    const existingEnrollment = await prisma.yearEnrollment.findUnique({
      where: {
        studentId_academicYear: {
          studentId: student.id,
          academicYear,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        error: `Already enrolled in academic year ${academicYear}`,
      });
    }

    // ============================================
    // PROGRESSION LOGIC: Check if student can enroll in this year
    // ============================================
    if (year > 1) {
      // Student wants to enroll in year 2+ → check if they have enough ECTS from previous year(s)

      // Get all grades for this student
      const studentGrades = await prisma.grade.findMany({
        where: {
          studentId: student.id,
          grade: { gte: 6 }, // Only passed exams (6-10)
        },
        include: { subject: true },
      });

      // Calculate total ECTS earned
      const earnedECTS = studentGrades.reduce(
        (sum, g) => sum + g.subject.ects,
        0
      );

      // Rule: To enroll in year N, student must have at least (N-1) * 48 ECTS
      // Example: Year 2 requires 48 ECTS, Year 3 requires 96 ECTS, etc.
      const requiredECTS = (year - 1) * 48;

      if (earnedECTS < requiredECTS) {
        return res.status(403).json({
          error: `Cannot enroll in year ${year}. You need ${requiredECTS} ECTS but only have ${earnedECTS}. Pass more exams from previous years.`,
        });
      }
    }

    // Fetch selected subjects with their details
    const selectedSubjects = await prisma.subject.findMany({
      where: { id: { in: subjects } },
      include: { yearPlan: true },
    });

    // Validate: all subjects must exist
    if (selectedSubjects.length !== subjects.length) {
      return res.status(400).json({ error: "Invalid subject IDs" });
    }

    // Validate: subjects belong to correct major and year
    const invalidSubjects = selectedSubjects.filter(
      (s) => s.majorId !== major.id || s.yearPlan.year !== year
    );
    if (invalidSubjects.length > 0) {
      return res.status(400).json({
        error: "Some subjects do not belong to selected major/year",
      });
    }

    // Calculate total ECTS
    const totalECTS = selectedSubjects.reduce((sum, s) => sum + s.ects, 0);

    // Validate: minimum 30 ECTS per semester (60 per year typically)
    if (totalECTS < 30) {
      return res.status(400).json({
        error: `Insufficient ECTS credits. You have ${totalECTS}, minimum is 30 per semester.`,
      });
    }

    // Validate: all required subjects are included
    const requiredSubjects = selectedSubjects.filter((s) => !s.isElective);
    const allRequiredSubjects = await prisma.subject.findMany({
      where: {
        majorId: major.id,
        isElective: false,
        yearPlan: { year },
      },
    });

    const missingRequired = allRequiredSubjects.filter(
      (req) => !requiredSubjects.find((sel) => sel.id === req.id)
    );
    if (missingRequired.length > 0) {
      return res.status(400).json({
        error: `Missing required subjects: ${missingRequired
          .map((s) => s.name)
          .join(", ")}`,
      });
    }

    // Validate: at least 2 elective subjects
    const electiveSubjects = selectedSubjects.filter((s) => s.isElective);
    if (electiveSubjects.length < 2) {
      return res.status(400).json({
        error: "You must select at least 2 elective subjects",
      });
    }

    // Create enrollment in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create year enrollment
      const yearEnrollment = await tx.yearEnrollment.create({
        data: {
          studentId: student.id,
          academicYear,
          year,
        },
      });

      // Create subject enrollments
      const subjectEnrollments = await Promise.all(
        selectedSubjects.map((subject) =>
          tx.subjectEnrollment.create({
            data: {
              studentId: student.id,
              subjectId: subject.id,
              academicYear,
              semester: subject.yearPlan.semester,
            },
          })
        )
      );

      // Update student's current year
      await tx.student.update({
        where: { id: student.id },
        data: { currentYear: year },
      });

      return { yearEnrollment, subjectEnrollments };
    });

    res.json({
      message: "Successfully enrolled",
      yearEnrollment: result.yearEnrollment,
      enrolledSubjects: result.subjectEnrollments.length,
      totalECTS,
    });
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ error: "Enrollment failed" });
  }
});

// GET /api/student/progress/:email - Get student's enrollment status and progress
app.get("/api/student/progress/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        major: true,
        yearEnrollments: {
          orderBy: { enrolledAt: "desc" },
        },
        subjectEnrollments: {
          include: {
            subject: true,
          },
        },
        grades: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Calculate progress
    const passedSubjects = student.grades.filter((g) => g.grade >= 6);
    const totalECTSEarned = passedSubjects.reduce(
      (sum, g) => sum + g.subject.ects,
      0
    );
    const enrolledECTS = student.subjectEnrollments.reduce(
      (sum, e) => sum + e.subject.ects,
      0
    );

    // Calculate if student can progress to next year
    const currentYear = student.currentYear;
    const nextYear = currentYear + 1;
    const requiredECTSForNextYear = currentYear * 48; // 48 ECTS per year minimum
    const canProgressToNextYear = totalECTSEarned >= requiredECTSForNextYear;
    const ectsNeededForNextYear = Math.max(
      0,
      requiredECTSForNextYear - totalECTSEarned
    );

    res.json({
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        indexNumber: student.indexNumber,
        currentYear: student.currentYear,
        status: student.status,
      },
      major: {
        id: student.major.id,
        name: student.major.name,
        code: student.major.code,
        duration: student.major.duration,
      },
      progress: {
        currentYear: student.currentYear,
        totalECTSEarned,
        enrolledECTS,
        passedSubjects: passedSubjects.length,
        totalSubjects: student.subjectEnrollments.length,
        canProgressToNextYear,
        nextYear: nextYear <= student.major.duration ? nextYear : null,
        ectsNeededForNextYear,
      },
      yearEnrollments: student.yearEnrollments,
      subjectEnrollments: student.subjectEnrollments.map((e) => ({
        // Provide the actual subject id and name so frontend can match grades correctly
        id: e.subject.id,
        name: e.subject.name,
        ects: e.subject.ects,
        semester: e.semester,
        academicYear: e.academicYear,
      })),
    });
  } catch (err) {
    console.error("Progress fetch error:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// GET /api/student/grades/:email - Get student's grades
app.get("/api/student/grades/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const grades = await prisma.grade.findMany({
      where: { studentId: student.id },
      include: {
        subject: true,
      },
    });

    res.json(grades);
  } catch (err) {
    console.error("Grades fetch error:", err);
    res.status(500).json({ error: "Failed to fetch grades" });
  }
});

// POST /api/student/grade - Quick endpoint to add a single grade by student email and subjectId
app.post("/api/student/grade", async (req, res) => {
  try {
    const { email, subjectId, grade, points, examType } = req.body || {};
    if (!email || !subjectId || typeof grade === "undefined") {
      return res
        .status(400)
        .json({ error: "Missing email, subjectId or grade" });
    }

    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const subject = await prisma.subject.findUnique({
      where: { id: Number(subjectId) },
    });
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    const created = await prisma.grade.create({
      data: {
        studentId: student.id,
        subjectId: subject.id,
        grade: Number(grade),
        points:
          typeof points !== "undefined"
            ? Number(points)
            : Math.min(100, 60 + subject.ects * 5),
        examDate: new Date(),
        examType: examType || "REGULAR",
        academicYear: `${new Date().getFullYear()}/${
          new Date().getFullYear() + 1
        }`,
      },
    });

    res.json({ message: "Grade created", grade: created });
  } catch (err) {
    console.error("Create grade error:", err);
    res.status(500).json({ error: "Failed to create grade" });
  }
});

// ============================================
// PROFESSOR ENDPOINTS
// ============================================

// GET /api/professors - Get all professors
app.get("/api/professors", async (_req, res) => {
  try {
    const professors = await prisma.professor.findMany({
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    const formatted = professors.map((prof) => ({
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

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching professors:", err);
    res.status(500).json({ error: "Failed to fetch professors" });
  }
});

// GET /api/professors/:id - Get professor by ID
app.get("/api/professors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const professor = await prisma.professor.findUnique({
      where: { id: Number(id) },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!professor) {
      return res.status(404).json({ error: "Professor not found" });
    }

    const formatted = {
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

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching professor:", err);
    res.status(500).json({ error: "Failed to fetch professor" });
  }
});

// GET /api/professors/email/:email - Get professor by email
app.get("/api/professors/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

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
      return res.status(404).json({ error: "Professor not found" });
    }

    const formatted = {
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

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching professor:", err);
    res.status(500).json({ error: "Failed to fetch professor" });
  }
});

// POST /api/professors - Create a new professor
app.post("/api/professors", async (req, res) => {
  try {
    const { firstName, lastName, email, password, title, office, subjectIds } =
      req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if professor with email already exists
    const existing = await prisma.professor.findUnique({
      where: { email },
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "Professor with this email already exists" });
    }

    // Create professor
    const professor = await prisma.professor.create({
      data: {
        firstName,
        lastName,
        email,
        password, // In production, hash this!
        title: title || "Prof",
        office: office || null,
      },
    });

    // Assign subjects if provided
    if (subjectIds && Array.isArray(subjectIds) && subjectIds.length > 0) {
      await prisma.professorSubject.createMany({
        data: subjectIds.map((subjectId: number) => ({
          professorId: professor.id,
          subjectId,
        })),
      });
    }

    // Fetch complete professor data with subjects
    const completeProf = await prisma.professor.findUnique({
      where: { id: professor.id },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    res.json(completeProf);
  } catch (err) {
    console.error("Error creating professor:", err);
    res.status(500).json({ error: "Failed to create professor" });
  }
});

// PUT /api/professors/:id/subjects - Update professor's subjects
app.put("/api/professors/:id/subjects", async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectIds } = req.body;

    if (!subjectIds || !Array.isArray(subjectIds)) {
      return res.status(400).json({ error: "Invalid subjectIds" });
    }

    const professorId = Number(id);

    // Check if professor exists
    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
    });

    if (!professor) {
      return res.status(404).json({ error: "Professor not found" });
    }

    // Delete old assignments
    await prisma.professorSubject.deleteMany({
      where: { professorId },
    });

    // Create new assignments
    if (subjectIds.length > 0) {
      await prisma.professorSubject.createMany({
        data: subjectIds.map((subjectId: number) => ({
          professorId,
          subjectId,
        })),
      });
    }

    // Fetch updated professor
    const updated = await prisma.professor.findUnique({
      where: { id: professorId },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating professor subjects:", err);
    res.status(500).json({ error: "Failed to update subjects" });
  }
});

// DELETE /api/professors/:id - Delete professor
app.delete("/api/professors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const professor = await prisma.professor.findUnique({
      where: { id: Number(id) },
    });

    if (!professor) {
      return res.status(404).json({ error: "Professor not found" });
    }

    await prisma.professor.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Professor deleted successfully" });
  } catch (err) {
    console.error("Error deleting professor:", err);
    res.status(500).json({ error: "Failed to delete professor" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
