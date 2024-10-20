/*
  Warnings:

  - You are about to drop the column `putonProductId` on the `UserAvatar` table. All the data in the column will be lost.
  - You are about to drop the column `putonProductImage` on the `UserAvatar` table. All the data in the column will be lost.
  - You are about to drop the column `avatarId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,productId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `UserAvatar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,productId]` on the table `WishlistItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `avatarImage` to the `UserAvatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chest` to the `UserAvatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `UserAvatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skinTone` to the `UserAvatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserAvatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userImage` to the `UserAvatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waist` to the `UserAvatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `UserAvatar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_avatarId_fkey";

-- DropIndex
DROP INDEX "WishlistItem_userId_key";

-- DropIndex
DROP INDEX "users_avatarId_key";

-- AlterTable
ALTER TABLE "UserAvatar" DROP COLUMN "putonProductId",
DROP COLUMN "putonProductImage",
ADD COLUMN     "avatarImage" TEXT NOT NULL,
ADD COLUMN     "chest" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cupSize" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "skinTone" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "userImage" TEXT NOT NULL,
ADD COLUMN     "waist" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarId";

-- CreateTable
CREATE TABLE "UserAvatarCache" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "CachedImage" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAvatarCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAvatarCache_userId_productId_key" ON "UserAvatarCache"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_productId_key" ON "CartItem"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAvatar_userId_key" ON "UserAvatar"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_userId_productId_key" ON "WishlistItem"("userId", "productId");

-- AddForeignKey
ALTER TABLE "UserAvatar" ADD CONSTRAINT "UserAvatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAvatarCache" ADD CONSTRAINT "UserAvatarCache_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
