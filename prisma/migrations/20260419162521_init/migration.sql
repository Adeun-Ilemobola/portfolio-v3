-- CreateEnum
CREATE TYPE "FileKindSchema" AS ENUM ('image', 'video', 'audio', 'document', 'other');

-- CreateTable
CREATE TABLE "file" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "FileKindSchema" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "remoteUrl" TEXT NOT NULL,
    "alt" TEXT,
    "caption" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);
