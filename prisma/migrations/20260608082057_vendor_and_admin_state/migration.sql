-- AlterTable
ALTER TABLE "admin_profiles" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "vendor_profiles" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;
