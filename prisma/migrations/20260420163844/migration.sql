/*
  Warnings:

  - Added the required column `loginCode` to the `authSessionSchema` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authSessionSchema" ADD COLUMN     "loginCode" TEXT NOT NULL;
