-- AlterTable
ALTER TABLE "project" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
