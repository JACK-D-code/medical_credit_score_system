/*
  Warnings:

  - You are about to alter the column `description` on the `patient_activities` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - The `metadata` column on the `patient_activities` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "patient_activities" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500),
DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSONB;
