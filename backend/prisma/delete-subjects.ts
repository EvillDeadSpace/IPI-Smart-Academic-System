import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function deleteAllSubjects() {
  console.log("🗑️  Brisanje svih predmeta...");
  const result = await prisma.subject.deleteMany();
  console.log(`✅ Obrisano ${result.count} predmeta`);
}

deleteAllSubjects()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Greška:", e);
    prisma.$disconnect();
    process.exit(1);
  });
