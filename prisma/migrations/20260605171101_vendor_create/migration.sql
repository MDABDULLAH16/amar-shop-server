/*
  Warnings:

  - You are about to drop the column `shopName` on the `vendor_profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vendorId]` on the table `customer_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subdomain]` on the table `vendor_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[domain]` on the table `vendor_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorId` to the `customer_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdomain` to the `vendor_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "vendor_profiles_shopName_key";

-- AlterTable
ALTER TABLE "customer_profiles" ADD COLUMN     "vendorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vendor_profiles" DROP COLUMN "shopName",
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "subdomain" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_vendorId_key" ON "customer_profiles"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_subdomain_key" ON "vendor_profiles"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_domain_key" ON "vendor_profiles"("domain");

-- AddForeignKey
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
