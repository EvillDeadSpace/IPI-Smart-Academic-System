import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Počinjem dodavati podatke...");

  // ============================================
  // 1. KREIRAJ 3 SMJERA
  // ============================================

  const compMajor = await prisma.major.create({
    data: {
      name: "Informatika i računarstvo",
      code: "COMP",
      description: "Četverogodišnji studij računarstva (240 ECTS)",
      duration: 4,
    },
  });

  const itMajor = await prisma.major.create({
    data: {
      name: "Informacione tehnologije",
      code: "IT",
      description: "Trogodišnji stručni studij (180 ECTS)",
      duration: 3,
    },
  });

  const acfiMajor = await prisma.major.create({
    data: {
      name: "Računovodstvo i finansije",
      code: "ACFI",
      description: "Četverogodišnji studij računovodstva (240 ECTS)",
      duration: 4,
    },
  });

  console.log("✅ Smjerovi kreirani");

  // ============================================
  // 2. INFORMATIKA I RAČUNARSTVO - PRVA GODINA
  // ============================================

  // Semestar 1
  const compY1S1 = await prisma.yearPlan.create({
    data: { year: 1, semester: 1, majorId: compMajor.id },
  });

  await prisma.subject.createMany({
    data: [
      {
        name: "Matematika",
        code: "COMP-O1",
        ects: 6,
        isElective: false,
        yearPlanId: compY1S1.id,
        majorId: compMajor.id,
      },
      {
        name: "Uvod u računarstvo i informacione tehnologije",
        code: "COMP-R1",
        ects: 6,
        isElective: false,
        yearPlanId: compY1S1.id,
        majorId: compMajor.id,
      },
      {
        name: "Osnove programiranja",
        code: "COMP-R2",
        ects: 6,
        isElective: false,
        yearPlanId: compY1S1.id,
        majorId: compMajor.id,
      },
      {
        name: "Poslovna informatika",
        code: "COMP-IP1",
        ects: 6,
        isElective: true,
        yearPlanId: compY1S1.id,
        majorId: compMajor.id,
      },
      {
        name: "Web dizajn",
        code: "COMP-IP2",
        ects: 6,
        isElective: true,
        yearPlanId: compY1S1.id,
        majorId: compMajor.id,
      },
    ],
  });

  // Semestar 2
  const compY1S2 = await prisma.yearPlan.create({
    data: { year: 1, semester: 2, majorId: compMajor.id },
  });

  await prisma.subject.createMany({
    data: [
      {
        name: "Uvod u informacione sisteme",
        code: "COMP-I1",
        ects: 6,
        isElective: false,
        yearPlanId: compY1S2.id,
        majorId: compMajor.id,
      },
      {
        name: "Strukture podataka i algoritmi",
        code: "COMP-R3",
        ects: 7,
        isElective: false,
        yearPlanId: compY1S2.id,
        majorId: compMajor.id,
      },
      {
        name: "Operativni sistemi",
        code: "COMP-R4",
        ects: 6,
        isElective: false,
        yearPlanId: compY1S2.id,
        majorId: compMajor.id,
      },
      {
        name: "Digitalna fotografija",
        code: "COMP-IP3",
        ects: 6,
        isElective: true,
        yearPlanId: compY1S2.id,
        majorId: compMajor.id,
      },
      {
        name: "Poslovni engleski jezik",
        code: "COMP-O2",
        ects: 5,
        isElective: false,
        yearPlanId: compY1S2.id,
        majorId: compMajor.id,
      },
    ],
  });

  // ============================================
  // DRUGA GODINA
  // ============================================

  const compY2S3 = await prisma.yearPlan.create({
    data: { year: 2, semester: 1, majorId: compMajor.id },
  });

  await prisma.subject.createMany({
    data: [
      {
        name: "Programski jezici i programiranje",
        code: "COMP-R5",
        ects: 6,
        isElective: false,
        yearPlanId: compY2S3.id,
        majorId: compMajor.id,
      },
      {
        name: "Računarske mreže",
        code: "COMP-R6",
        ects: 6,
        isElective: false,
        yearPlanId: compY2S3.id,
        majorId: compMajor.id,
      },
      {
        name: "Razvoj i izgradnja informacionih sistema",
        code: "COMP-I2",
        ects: 6,
        isElective: false,
        yearPlanId: compY2S3.id,
        majorId: compMajor.id,
      },
      {
        name: "Multimedijske tehnologije",
        code: "COMP-IP4",
        ects: 6,
        isElective: true,
        yearPlanId: compY2S3.id,
        majorId: compMajor.id,
      },
      {
        name: "Projektni menadžment",
        code: "COMP-IP5",
        ects: 6,
        isElective: true,
        yearPlanId: compY2S3.id,
        majorId: compMajor.id,
      },
    ],
  });

  const compY2S4 = await prisma.yearPlan.create({
    data: { year: 2, semester: 2, majorId: compMajor.id },
  });

  await prisma.subject.createMany({
    data: [
      {
        name: "Baze podataka",
        code: "COMP-R8",
        ects: 6,
        isElective: false,
        yearPlanId: compY2S4.id,
        majorId: compMajor.id,
      },
      {
        name: "Elektronsko poslovanje",
        code: "COMP-I4",
        ects: 6,
        isElective: false,
        yearPlanId: compY2S4.id,
        majorId: compMajor.id,
      },
      {
        name: "Objektno programiranje",
        code: "COMP-R9",
        ects: 6,
        isElective: false,
        yearPlanId: compY2S4.id,
        majorId: compMajor.id,
      },
      {
        name: "Istraživanje tržišta",
        code: "COMP-IP6",
        ects: 6,
        isElective: true,
        yearPlanId: compY2S4.id,
        majorId: compMajor.id,
      },
      {
        name: "Statistika i istraživačke metode",
        code: "COMP-IP7",
        ects: 6,
        isElective: true,
        yearPlanId: compY2S4.id,
        majorId: compMajor.id,
      },
    ],
  });

  // ============================================
  // TREĆA GODINA
  // ============================================

  const compY3S5 = await prisma.yearPlan.create({
    data: { year: 3, semester: 1, majorId: compMajor.id },
  });

  await prisma.subject.createMany({
    data: [
      {
        name: "Kontrola i revizija informacionih sistema",
        code: "COMP-I15",
        ects: 6,
        isElective: false,
        yearPlanId: compY3S5.id,
        majorId: compMajor.id,
      },
      {
        name: "Programiranje u JAVI",
        code: "COMP-R11",
        ects: 6,
        isElective: false,
        yearPlanId: compY3S5.id,
        majorId: compMajor.id,
      },
      {
        name: "Društvene mreže",
        code: "COMP-I14",
        ects: 6,
        isElective: false,
        yearPlanId: compY3S5.id,
        majorId: compMajor.id,
      },
      {
        name: "Video produkcija",
        code: "COMP-IP8",
        ects: 6,
        isElective: true,
        yearPlanId: compY3S5.id,
        majorId: compMajor.id,
      },
      {
        name: "Direktni marketing",
        code: "COMP-IP9",
        ects: 6,
        isElective: true,
        yearPlanId: compY3S5.id,
        majorId: compMajor.id,
      },
    ],
  });

  const compY3S6 = await prisma.yearPlan.create({
    data: { year: 3, semester: 2, majorId: compMajor.id },
  });

  await prisma.subject.createMany({
    data: [
      {
        name: "Razvoj mobilnih aplikacija",
        code: "COMP-R12",
        ects: 6,
        isElective: false,
        yearPlanId: compY3S6.id,
        majorId: compMajor.id,
      },
      {
        name: "Sigurnost elektronskog poslovanja",
        code: "COMP-I8",
        ects: 6,
        isElective: false,
        yearPlanId: compY3S6.id,
        majorId: compMajor.id,
      },
      {
        name: "Menadžment informatičkih projekata",
        code: "COMP-I16",
        ects: 6,
        isElective: false,
        yearPlanId: compY3S6.id,
        majorId: compMajor.id,
      },
      {
        name: "Menadžment informacioni sistemi",
        code: "COMP-IP10",
        ects: 6,
        isElective: true,
        yearPlanId: compY3S6.id,
        majorId: compMajor.id,
      },
      {
        name: "Poduzetništvo",
        code: "COMP-IP11",
        ects: 6,
        isElective: true,
        yearPlanId: compY3S6.id,
        majorId: compMajor.id,
      },
    ],
  });

  // ============================================
  // ČETVRTA GODINA
  // ============================================

  const compY4S7 = await prisma.yearPlan.create({
    data: { year: 4, semester: 1, majorId: compMajor.id },
  });

  await prisma.subject.createMany({
    data: [
      {
        name: "Elektronska trgovina",
        code: "COMP-I5",
        ects: 6,
        isElective: false,
        yearPlanId: compY4S7.id,
        majorId: compMajor.id,
      },
      {
        name: "Elektronsko bankarstvo i platni promet",
        code: "COMP-I6",
        ects: 6,
        isElective: false,
        yearPlanId: compY4S7.id,
        majorId: compMajor.id,
      },
      {
        name: "Web programiranje",
        code: "COMP-R7",
        ects: 6,
        isElective: false,
        yearPlanId: compY4S7.id,
        majorId: compMajor.id,
      },
      {
        name: "E-usluge",
        code: "COMP-IP12",
        ects: 6,
        isElective: true,
        yearPlanId: compY4S7.id,
        majorId: compMajor.id,
      },
      {
        name: "Berzansko poslovanje",
        code: "COMP-IP13",
        ects: 6,
        isElective: true,
        yearPlanId: compY4S7.id,
        majorId: compMajor.id,
      },
    ],
  });

  const compY4S8 = await prisma.yearPlan.create({
    data: { year: 4, semester: 2, majorId: compMajor.id },
  });

  await prisma.subject.createMany({
    data: [
      {
        name: "Tehnologije i sistemi za podršku korisnicima",
        code: "COMP-I11",
        ects: 6,
        isElective: false,
        yearPlanId: compY4S8.id,
        majorId: compMajor.id,
      },
      {
        name: "Multimedijsko izdavaštvo",
        code: "COMP-IP14",
        ects: 6,
        isElective: true,
        yearPlanId: compY4S8.id,
        majorId: compMajor.id,
      },
      {
        name: "Poslovno pravo i porezi",
        code: "COMP-IP15",
        ects: 6,
        isElective: true,
        yearPlanId: compY4S8.id,
        majorId: compMajor.id,
      },
      {
        name: "Stručna praksa",
        code: "COMP-PRAC",
        ects: 2,
        isElective: false,
        yearPlanId: compY4S8.id,
        majorId: compMajor.id,
      },
      {
        name: "Završni rad",
        code: "COMP-THESIS",
        ects: 10,
        isElective: false,
        yearPlanId: compY4S8.id,
        majorId: compMajor.id,
      },
    ],
  });

  console.log("✅ Informatika i računarstvo - svi predmeti dodani");

  // ============================================
  // 3. INFORMACIONE TEHNOLOGIJE (3 godine)
  // ============================================

  // Dodajem skraćenu verziju, isti princip kao gore
  const itY1S1 = await prisma.yearPlan.create({
    data: { year: 1, semester: 1, majorId: itMajor.id },
  });

  await prisma.subject.createMany({
    data: [
      {
        name: "Matematika",
        code: "IT-O1",
        ects: 6,
        isElective: false,
        yearPlanId: itY1S1.id,
        majorId: itMajor.id,
      },
      {
        name: "Uvod u računarstvo i informacione tehnologije",
        code: "IT-R1",
        ects: 6,
        isElective: false,
        yearPlanId: itY1S1.id,
        majorId: itMajor.id,
      },
      {
        name: "Osnove programiranja",
        code: "IT-R2",
        ects: 6,
        isElective: false,
        yearPlanId: itY1S1.id,
        majorId: itMajor.id,
      },
      {
        name: "Poslovna informatika",
        code: "IT-IP1",
        ects: 6,
        isElective: true,
        yearPlanId: itY1S1.id,
        majorId: itMajor.id,
      },
      {
        name: "Osnove marketinga i Internet marketing",
        code: "IT-IP2",
        ects: 6,
        isElective: true,
        yearPlanId: itY1S1.id,
        majorId: itMajor.id,
      },
    ],
  });

  console.log("✅ Informacione tehnologije - predmeti dodani");

  console.log("🎉 SVI PODACI DODANI U BAZU!");
}

main()
  .catch((e) => {
    console.error("❌ Greška:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
