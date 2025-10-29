import { getPrismaClient } from "../src/config/database";

const prisma = getPrismaClient();

async function enrollStudent() {
  try {
    console.log("🔍 Tražim studente...");
    const student = await prisma.student.findFirst();

    if (!student) {
      console.log("❌ Nema studenata u bazi!");
      return;
    }

    console.log(`✅ Student: ${student.firstName} ${student.lastName}`);
    console.log(`📅 Godina studija: ${student.currentYear}`);
    console.log(`🎓 Major ID: ${student.majorId}`);

    // Get subjects for student's major
    const subjects = await prisma.subject.findMany({
      where: {
        majorId: student.majorId,
        isElective: false, // First enroll in required subjects
      },
      take: 5,
    });

    console.log(`\n📚 Pronađeno ${subjects.length} obaveznih predmeta`);

    // Enroll student in each subject
    for (const subject of subjects) {
      const existing = await prisma.subjectEnrollment.findFirst({
        where: {
          studentId: student.id,
          subjectId: subject.id,
        },
      });

      if (existing) {
        console.log(`⏭️  Već upisan: ${subject.name}`);
        continue;
      }

      await prisma.subjectEnrollment.create({
        data: {
          studentId: student.id,
          subjectId: subject.id,
          semester: student.currentYear * 2 - 1, // 1st year = semester 1, 2nd year = semester 3, etc
          academicYear: "2024/2025",
        },
      });

      console.log(`✅ Upisan: ${subject.name} (${subject.code})`);
    }

    console.log("\n✨ Gotovo!");
  } catch (error) {
    console.error("❌ Greška:", error);
  } finally {
    await prisma.$disconnect();
  }
}

enrollStudent();
