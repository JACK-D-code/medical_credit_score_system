-- AlterTable
ALTER TABLE "users" ADD COLUMN     "account_locked_until" TIMESTAMP(3),
ADD COLUMN     "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_failed_login" TIMESTAMP(3);
