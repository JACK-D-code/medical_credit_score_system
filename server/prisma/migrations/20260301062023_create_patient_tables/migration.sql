-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "insurance_provider" TEXT,
    "insurance_policy_number" TEXT,
    "insurance_group_number" TEXT,
    "insurance_status" TEXT,
    "insurance_verified_at" TIMESTAMP(3),
    "medical_history_encrypted" TEXT,
    "allergies_encrypted" TEXT,
    "relationship_start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referral_source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bills" (
    "id" TEXT NOT NULL,
    "bill_number" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "provider_id" TEXT,
    "bill_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "service_description" TEXT,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "insurance_claim_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "insurance_paid_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "patient_responsibility" DOUBLE PRECISION NOT NULL,
    "paid_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outstanding_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_method" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_items" (
    "id" TEXT NOT NULL,
    "bill_id" TEXT NOT NULL,
    "item_code" TEXT,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "cpt_code" TEXT,
    "icd_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bill_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "payment_number" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "bill_id" TEXT,
    "emi_plan_id" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_id" TEXT,
    "gateway_name" TEXT,
    "gateway_response" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "refund_amount" DOUBLE PRECISION,
    "refund_date" TIMESTAMP(3),
    "refund_reason" TEXT,
    "refunded_by" TEXT,
    "notes" TEXT,
    "receipt_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_scores" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "risk_level" TEXT NOT NULL,
    "payment_history_score" DOUBLE PRECISION NOT NULL,
    "income_stability_score" DOUBLE PRECISION NOT NULL,
    "medical_debt_score" DOUBLE PRECISION NOT NULL,
    "insurance_coverage_score" DOUBLE PRECISION NOT NULL,
    "long_term_patient_bonus" INTEGER NOT NULL DEFAULT 0,
    "perfect_payment_bonus" INTEGER NOT NULL DEFAULT 0,
    "premium_insurance_bonus" INTEGER NOT NULL DEFAULT 0,
    "referral_bonus" INTEGER NOT NULL DEFAULT 0,
    "total_bonus" INTEGER NOT NULL DEFAULT 0,
    "payment_history_details" TEXT,
    "income_details" TEXT,
    "debt_details" TEXT,
    "insurance_details" TEXT,
    "calculation_version" TEXT NOT NULL,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculated_by" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emi_plans" (
    "id" TEXT NOT NULL,
    "plan_number" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "bill_id" TEXT NOT NULL,
    "credit_score_id" TEXT,
    "principal_amount" DOUBLE PRECISION NOT NULL,
    "down_payment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "financed_amount" DOUBLE PRECISION NOT NULL,
    "interest_rate" DOUBLE PRECISION NOT NULL,
    "duration_months" INTEGER NOT NULL,
    "monthly_installment" DOUBLE PRECISION NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "total_interest" DOUBLE PRECISION NOT NULL,
    "paid_installments" INTEGER NOT NULL DEFAULT 0,
    "total_paid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outstanding_balance" DOUBLE PRECISION NOT NULL,
    "next_due_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "approved_at" TIMESTAMP(3),
    "approved_by" TEXT,
    "terms_accepted_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "emi_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emi_installments" (
    "id" TEXT NOT NULL,
    "emi_plan_id" TEXT NOT NULL,
    "installment_number" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "principal_component" DOUBLE PRECISION NOT NULL,
    "interest_component" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paid_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paid_date" TIMESTAMP(3),
    "payment_id" TEXT,
    "late_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "late_fee_applied_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emi_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT,
    "user_id" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "email_sent" BOOLEAN NOT NULL DEFAULT false,
    "email_sent_at" TIMESTAMP(3),
    "sms_sent" BOOLEAN NOT NULL DEFAULT false,
    "sms_sent_at" TIMESTAMP(3),
    "in_app_read" BOOLEAN NOT NULL DEFAULT false,
    "in_app_read_at" TIMESTAMP(3),
    "bill_id" TEXT,
    "emi_plan_id" TEXT,
    "payment_id" TEXT,
    "delivery_status" TEXT NOT NULL DEFAULT 'pending',
    "delivery_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_attempt_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_patient_id_key" ON "patients"("patient_id");

-- CreateIndex
CREATE INDEX "patients_patient_id_idx" ON "patients"("patient_id");

-- CreateIndex
CREATE INDEX "patients_email_idx" ON "patients"("email");

-- CreateIndex
CREATE INDEX "patients_phone_idx" ON "patients"("phone");

-- CreateIndex
CREATE INDEX "patients_first_name_last_name_idx" ON "patients"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "bills_bill_number_key" ON "bills"("bill_number");

-- CreateIndex
CREATE INDEX "bills_bill_number_idx" ON "bills"("bill_number");

-- CreateIndex
CREATE INDEX "bills_patient_id_idx" ON "bills"("patient_id");

-- CreateIndex
CREATE INDEX "bills_status_idx" ON "bills"("status");

-- CreateIndex
CREATE INDEX "bills_due_date_idx" ON "bills"("due_date");

-- CreateIndex
CREATE INDEX "bills_created_at_idx" ON "bills"("created_at");

-- CreateIndex
CREATE INDEX "bill_items_bill_id_idx" ON "bill_items"("bill_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_number_key" ON "payments"("payment_number");

-- CreateIndex
CREATE INDEX "payments_payment_number_idx" ON "payments"("payment_number");

-- CreateIndex
CREATE INDEX "payments_patient_id_idx" ON "payments"("patient_id");

-- CreateIndex
CREATE INDEX "payments_bill_id_idx" ON "payments"("bill_id");

-- CreateIndex
CREATE INDEX "payments_emi_plan_id_idx" ON "payments"("emi_plan_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_payment_date_idx" ON "payments"("payment_date");

-- CreateIndex
CREATE INDEX "credit_scores_patient_id_idx" ON "credit_scores"("patient_id");

-- CreateIndex
CREATE INDEX "credit_scores_score_idx" ON "credit_scores"("score");

-- CreateIndex
CREATE INDEX "credit_scores_calculated_at_idx" ON "credit_scores"("calculated_at");

-- CreateIndex
CREATE UNIQUE INDEX "emi_plans_plan_number_key" ON "emi_plans"("plan_number");

-- CreateIndex
CREATE INDEX "emi_plans_plan_number_idx" ON "emi_plans"("plan_number");

-- CreateIndex
CREATE INDEX "emi_plans_patient_id_idx" ON "emi_plans"("patient_id");

-- CreateIndex
CREATE INDEX "emi_plans_bill_id_idx" ON "emi_plans"("bill_id");

-- CreateIndex
CREATE INDEX "emi_plans_status_idx" ON "emi_plans"("status");

-- CreateIndex
CREATE INDEX "emi_plans_next_due_date_idx" ON "emi_plans"("next_due_date");

-- CreateIndex
CREATE INDEX "emi_installments_emi_plan_id_idx" ON "emi_installments"("emi_plan_id");

-- CreateIndex
CREATE INDEX "emi_installments_due_date_idx" ON "emi_installments"("due_date");

-- CreateIndex
CREATE INDEX "emi_installments_status_idx" ON "emi_installments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "emi_installments_emi_plan_id_installment_number_key" ON "emi_installments"("emi_plan_id", "installment_number");

-- CreateIndex
CREATE INDEX "notifications_patient_id_idx" ON "notifications"("patient_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_items" ADD CONSTRAINT "bill_items_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_emi_plan_id_fkey" FOREIGN KEY ("emi_plan_id") REFERENCES "emi_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_refunded_by_fkey" FOREIGN KEY ("refunded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_scores" ADD CONSTRAINT "credit_scores_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_scores" ADD CONSTRAINT "credit_scores_calculated_by_fkey" FOREIGN KEY ("calculated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emi_plans" ADD CONSTRAINT "emi_plans_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emi_plans" ADD CONSTRAINT "emi_plans_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emi_plans" ADD CONSTRAINT "emi_plans_credit_score_id_fkey" FOREIGN KEY ("credit_score_id") REFERENCES "credit_scores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emi_plans" ADD CONSTRAINT "emi_plans_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emi_plans" ADD CONSTRAINT "emi_plans_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emi_installments" ADD CONSTRAINT "emi_installments_emi_plan_id_fkey" FOREIGN KEY ("emi_plan_id") REFERENCES "emi_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emi_installments" ADD CONSTRAINT "emi_installments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
