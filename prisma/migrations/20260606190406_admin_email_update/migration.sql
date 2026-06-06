/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `admin_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `admin_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin_profiles" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_email_key" ON "admin_profiles"("email");
