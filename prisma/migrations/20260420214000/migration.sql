/*
  Warnings:

  - Changed the type of `expire` on the `authSessionSchema` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "authSessionSchema" DROP COLUMN "expire",
ADD COLUMN     "expire" TIMESTAMP(3) NOT NULL;
