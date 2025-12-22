-- AlterTable
ALTER TABLE "NewsInformation" ADD COLUMN     "eventDate" TIMESTAMP(3),
ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT true;
