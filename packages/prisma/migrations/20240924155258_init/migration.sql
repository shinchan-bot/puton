/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `otps` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "otps" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "otps_phone_key" ON "otps"("phone");
