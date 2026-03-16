-- CreateTable
CREATE TABLE "dynamic_credit_scores" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "total_score" INTEGER NOT NULL,
    "activity_points" INTEGER NOT NULL DEFAULT 0,
    "bonus_points" INTEGER NOT NULL DEFAULT 0,
    "penalty_points" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "score_breakdown" TEXT NOT NULL,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dynamic_credit_scores_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "dynamic_credit_scores_total_score_check" CHECK (total_score >= 300 AND total_score <= 850),
    CONSTRAINT "dynamic_credit_scores_category_check" CHECK (category IN ('Excellent', 'Good', 'Average', 'Low'))
);

-- CreateIndex
CREATE INDEX "dynamic_credit_scores_patient_id_idx" ON "dynamic_credit_scores"("patient_id");

-- CreateIndex
CREATE INDEX "dynamic_credit_scores_total_score_idx" ON "dynamic_credit_scores"("total_score");

-- CreateIndex
CREATE INDEX "dynamic_credit_scores_calculated_at_idx" ON "dynamic_credit_scores"("calculated_at");

-- CreateIndex
CREATE UNIQUE INDEX "dynamic_credit_scores_patient_id_calculated_at_key" ON "dynamic_credit_scores"("patient_id", "calculated_at");

-- AddForeignKey
ALTER TABLE "dynamic_credit_scores" ADD CONSTRAINT "dynamic_credit_scores_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
