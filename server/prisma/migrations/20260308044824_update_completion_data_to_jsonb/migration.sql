/*
  Warnings:

  - The `completion_data` column on the `patient_task_completions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "patient_task_completions" DROP COLUMN "completion_data",
ADD COLUMN     "completion_data" JSONB;
