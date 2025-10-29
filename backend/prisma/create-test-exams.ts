import { getPrismaClient } from "../src/config/database";

const prisma = getPrismaClient();

async function createTestExams() {
  try {
    console.log("🔍 Tražim studente...");
    const students = await prisma.student.findMany({ take: 1 });

    if (students.length === 0) {
      console.log("❌ Nema studenata u bazi!");
      return;
    }

    const student = students[0];
    console.log(
      `✅ Student: ${student.firstName} ${student.lastName} (${student.email})`
    );

    console.log("\n🔍 Tražim profesore...");
    const professors = await prisma.professor.findMany({ take: 1 });

    if (professors.length === 0) {
      console.log("❌ Nema profesora u bazi!");
      return;
    }

    const professor = professors[0];
    console.log(`✅ Profesor: ${professor.firstName} ${professor.lastName}`);

    console.log("\n🔍 Tražim predmete za studenta...");
    const enrollments = await prisma.subjectEnrollment.findMany({
      where: { studentId: student.id },
      include: { subject: true },
      take: 3,
    });

    if (enrollments.length === 0) {
      console.log("❌ Student nije upisan ni na jedan predmet!");
      return;
    }

    console.log(`✅ Pronašao ${enrollments.length} predmeta`);

    // Create exams for each subject
    console.log("\n📝 Kreiram ispite...");
    for (const enrollment of enrollments) {
      const subject = enrollment.subject;

      // Check if exam already exists
      const existing = await prisma.exam.findFirst({
        where: {
          subjectId: subject.id,
          examTime: { gte: new Date() },
        },
      });

      if (existing) {
        console.log(`⏭️  Ispit za ${subject.name} već postoji`);
        continue;
      }

      // Create exam 7 days from now
      const examDate = new Date();
      examDate.setDate(examDate.getDate() + 7);
      examDate.setHours(10, 0, 0, 0);

      const exam = await prisma.exam.create({
        data: {
          subjectId: subject.id,
          professorId: professor.id,
          examTime: examDate,
          location: `Amfiteatar ${Math.floor(Math.random() * 3) + 1}`,
          maxPoints: 100,
        },
      });

      console.log(
        `✅ Kreiran ispit: ${subject.name} - ${examDate.toLocaleDateString()}`
      );
    }

    console.log("\n✨ Gotovo! Ispiti kreirani.");
  } catch (error) {
    console.error("❌ Greška:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestExams();
