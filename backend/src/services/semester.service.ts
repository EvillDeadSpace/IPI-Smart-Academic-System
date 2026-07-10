import { SemesterType } from "../../generated/prisma";
import { getPrismaClient } from "../config/database";

function buildName(type: SemesterType, year: string) {
  return `${type === "WINTER" ? "Zimski" : "Ljetni"} semestar ${year}`;
}

const prisma = getPrismaClient();

export class SemesterService {
  static async getAll() {
    return prisma.semester.findMany({
      orderBy: [{ isActive: "desc" }, { startDate: "desc" }],
    });
  }

  static async getCurrent() {
    const semester = await prisma.semester.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        year: true,
        type: true,
        startDate: true,
        endDate: true,
      },
    });
    return semester ?? null;
  }

  static async create(data: {
    year: string;
    type: SemesterType;
    startDate: Date;
    endDate: Date;
  }) {
    if (data.endDate <= data.startDate) {
      throw new Error("endDate mora biti nakon startDate");
    }
    return prisma.semester.create({
      data: { ...data, name: buildName(data.type, data.year) },
    });
  }

  static async update(
    id: number,
    data: {
      year?: string;
      type?: SemesterType;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const existing = await prisma.semester.findUnique({ where: { id } });
    if (!existing) throw new Error("Semestar nije pronađen");

    const startDate = data.startDate ?? existing.startDate;
    const endDate = data.endDate ?? existing.endDate;
    if (endDate <= startDate) {
      throw new Error("endDate mora biti nakon startDate");
    }

    const type = data.type ?? existing.type;
    const year = data.year ?? existing.year;
    return prisma.semester.update({
      where: { id },
      data: { ...data, name: buildName(type, year) },
    });
  }

  static async delete(id: number) {
    const existing = await prisma.semester.findUnique({ where: { id } });
    if (!existing) throw new Error("Semestar nije pronađen");
    return prisma.semester.delete({ where: { id } });
  }

  static async activate(id: number) {
    const existing = await prisma.semester.findUnique({ where: { id } });
    if (!existing) throw new Error("Semestar nije pronađen");

    return prisma.$transaction([
      prisma.semester.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      }),
      prisma.semester.update({
        where: { id },
        data: { isActive: true },
      }),
    ]);
  }
}
