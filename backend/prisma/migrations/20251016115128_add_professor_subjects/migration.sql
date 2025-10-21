/*
  Warnings:

  - Added the required column `password` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "office" TEXT,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProfessorSubject" (
    "id" SERIAL NOT NULL,
    "professorId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfessorSubject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfessorSubject_professorId_idx" ON "ProfessorSubject"("professorId");

-- CreateIndex
CREATE INDEX "ProfessorSubject_subjectId_idx" ON "ProfessorSubject"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorSubject_professorId_subjectId_key" ON "ProfessorSubject"("professorId", "subjectId");

-- AddForeignKey
ALTER TABLE "ProfessorSubject" ADD CONSTRAINT "ProfessorSubject_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorSubject" ADD CONSTRAINT "ProfessorSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
