-- CreateTable
CREATE TABLE "provider_bonus" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "bonus_points" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "approval_status" TEXT NOT NULL DEFAULT 'pending',
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_bonus_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "provider_bonus_bonus_points_check" CHECK (bonus_points >= 1 AND bonus_points <= 50),
    CONSTRAINT "provider_bonus_approval_status_check" CHECK (approval_status IN ('pending', 'approved', 'rejected'))
);

-- CreateIndex
CREATE INDEX "provider_bonus_patient_id_idx" ON "provider_bonus"("patient_id");

-- CreateIndex
CREATE INDEX "provider_bonus_approval_status_idx" ON "provider_bonus"("approval_status");

-- AddForeignKey
ALTER TABLE "provider_bonus" ADD CONSTRAINT "provider_bonus_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_bonus" ADD CONSTRAINT "provider_bonus_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_bonus" ADD CONSTRAINT "provider_bonus_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON UPDATE CASCADE;
