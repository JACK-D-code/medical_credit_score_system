-- CreateTable
CREATE TABLE "health_tasks" (
    "id" TEXT NOT NULL,
    "task_name" TEXT NOT NULL,
    "task_type" TEXT NOT NULL,
    "points_reward" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "validation_required" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_tasks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "health_tasks_task_type_check" CHECK ("task_type" IN ('daily_walking', 'water_reminder', 'health_quiz', 'bp_logging')),
    CONSTRAINT "health_tasks_points_reward_check" CHECK ("points_reward" BETWEEN 1 AND 10)
);

-- CreateTable
CREATE TABLE "patient_task_completions" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "completion_date" DATE NOT NULL,
    "completion_data" TEXT,
    "points_earned" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_task_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "health_tasks_task_name_key" ON "health_tasks"("task_name");

-- CreateIndex
CREATE INDEX "patient_task_completions_patient_id_idx" ON "patient_task_completions"("patient_id");

-- CreateIndex
CREATE INDEX "patient_task_completions_completion_date_idx" ON "patient_task_completions"("completion_date");

-- CreateIndex
CREATE UNIQUE INDEX "patient_task_completions_patient_id_task_id_completion_date_key" ON "patient_task_completions"("patient_id", "task_id", "completion_date");

-- AddForeignKey
ALTER TABLE "patient_task_completions" ADD CONSTRAINT "patient_task_completions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_task_completions" ADD CONSTRAINT "patient_task_completions_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "health_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
