-- AlterTable
ALTER TABLE "User" ADD COLUMN     "regimeChangeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "regimeChangedAt" TIMESTAMP(3);
