/*
  Warnings:

  - Made the column `userId` on table `BusinessSettings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BusinessSettings" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "userId" SET NOT NULL;
