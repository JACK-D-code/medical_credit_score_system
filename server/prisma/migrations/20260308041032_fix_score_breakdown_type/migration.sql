/*
  Warnings:

  - Changed the type of `score_breakdown` on the `dynamic_credit_scores` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "dynamic_credit_scores" DROP COLUMN "score_breakdown",
ADD COLUMN     "score_breakdown" JSONB NOT NULL;
