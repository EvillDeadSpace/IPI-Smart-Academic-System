import { getPrismaClient } from "../src/config/database";

const prisma = getPrismaClient();

async function testEndpoint() {
  try {
    const email = "marko.m@example.com";

    console.log(`\n🧪 Testing Available Exams Endpoint for: ${email}`);
    console.log("─".repeat(60));

    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        subjectEnrollments: { include: { subject: true } },
        examRegistrations: { include: { exam: true } },
      },
    });

    if (!student) {
      console.log("❌ Student not found!");
      return;
    }

    const subjectIds = student.subjectEnrollments.map((e) => e.subjectId);
    const registeredExamIds = student.examRegistrations.map((r) => r.examId);

    console.log(`📚 Student enrolled in ${subjectIds.length} subjects`);
    console.log(`✅ Already registered for ${registeredExamIds.length} exams`);

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(`📅 Today (midnight): ${today.toISOString()}`);

    // Get exams for enrolled subjects that student hasn't registered for
    const exams = await prisma.exam.findMany({
      where: {
        subjectId: { in: subjectIds },
        id: { notIn: registeredExamIds },
        examTime: { gte: today }, // Only exams from today onwards
      },
      include: {
        subject: true,
        professor: true,
      },
      orderBy: { examTime: "asc" },
    });

    console.log(`\n📝 Available Exams: ${exams.length}`);
    console.log("─".repeat(60));

    exams.forEach((exam, index) => {
      console.log(`\n${index + 1}. ${exam.subject.name}`);
      console.log(`   📅 Date: ${exam.examTime.toLocaleString()}`);
      console.log(
        `   👨‍🏫 Professor: ${exam.professor.firstName} ${exam.professor.lastName}`
      );
      console.log(`   📍 Location: ${exam.location || "N/A"}`);
      console.log(`   💯 Max Points: ${exam.maxPoints}`);
    });

    if (exams.length === 0) {
      console.log("\n⚠️ No available exams found!");
      console.log("Possible reasons:");
      console.log("  - All exams are in the past");
      console.log("  - Student already registered for all exams");
      console.log("  - No exams created for enrolled subjects");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testEndpoint();
