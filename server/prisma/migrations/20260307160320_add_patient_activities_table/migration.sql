-- AlterTable
ALTER TABLE "PatientProfile" ADD COLUMN     "providerEvaluationNotes" TEXT,
ADD COLUMN     "providerGrantedPoints" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "patient_activities" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_activities_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "patient_activities_activity_type_check" CHECK (activity_type IN ('checkup_visit', 'medicine_adherence', 'health_task', 'education_video', 'community_health_program', 'loyalty_visit')),
    CONSTRAINT "patient_activities_points_check" CHECK (points > 0)
);

-- CreateIndex
CREATE INDEX "patient_activities_patient_id_idx" ON "patient_activities"("patient_id");

-- CreateIndex
CREATE INDEX "patient_activities_activity_type_idx" ON "patient_activities"("activity_type");

-- CreateIndex
CREATE INDEX "patient_activities_created_at_idx" ON "patient_activities"("created_at");

-- AddForeignKey
ALTER TABLE "patient_activities" ADD CONSTRAINT "patient_activities_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
