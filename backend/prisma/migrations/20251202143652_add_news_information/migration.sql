-- CreateTable
CREATE TABLE "NewsInformation" (
    "id" SERIAL NOT NULL,
    "tagName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "linksParent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsInformation_pkey" PRIMARY KEY ("id")
);
