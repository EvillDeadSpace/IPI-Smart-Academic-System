import { getPrismaClient } from "../src/config/database";

const prisma = getPrismaClient();

async function checkEnrollment() {
  try {
    const student = await prisma.student.findFirst({
      include: {
        subjectEnrollments: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!student) {
      console.log("❌ Nema studenta u bazi!");
      return;
    }

    console.log(
      `\n👤 Student: ${student.firstName} ${student.lastName} (${student.email})`
    );
    console.log(
      `\n📚 Upisani predmeti (${student.subjectEnrollments.length}):`
    );

    student.subjectEnrollments.forEach((enrollment, index) => {
      console.log(
        `${index + 1}. ${enrollment.subject.name} (${enrollment.subject.code})`
      );
    });

    // Check all available exams
    console.log("\n\n📝 Svi dostupni ispiti:");
    const allExams = await prisma.exam.findMany({
      include: {
        subject: true,
        professor: true,
      },
      orderBy: {
        examTime: "asc",
      },
    });

    if (allExams.length === 0) {
      console.log("❌ Nema ispita u bazi!");
    } else {
      allExams.forEach((exam, index) => {
        const isEnrolled = student.subjectEnrollments.some(
          (e) => e.subjectId === exam.subjectId
        );
        console.log(
          `${index + 1}. ${
            exam.subject.name
          } - ${exam.examTime.toLocaleDateString()} ${
            isEnrolled ? "✅ (upisan)" : "❌ (nije upisan)"
          }`
        );
      });
    }
  } catch (error) {
    console.error("❌ Greška:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnrollment();
