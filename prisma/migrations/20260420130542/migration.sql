/*
  Warnings:

  - Added the required column `cloudKey` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "cloudKey" TEXT NOT NULL;
