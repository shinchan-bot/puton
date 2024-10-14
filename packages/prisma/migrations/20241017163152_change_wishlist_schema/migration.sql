/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `WishlistItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `WishlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WishlistItem" ADD COLUMN     "productId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_userId_key" ON "WishlistItem"("userId");

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
