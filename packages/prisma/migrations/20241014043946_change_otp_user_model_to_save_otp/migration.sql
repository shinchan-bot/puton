/*
  Warnings:

  - You are about to drop the column `otpId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `otps` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `otps` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `otps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `otps` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_otpId_fkey";

-- DropIndex
DROP INDEX "users_otpId_key";

-- AlterTable
ALTER TABLE "otps" ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "otpId",
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "measurements" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "otps_userId_key" ON "otps"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "otps_phone_key" ON "otps"("phone");

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
