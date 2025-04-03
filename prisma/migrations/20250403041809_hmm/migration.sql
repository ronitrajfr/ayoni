/*
  Warnings:

  - You are about to drop the column `public` on the `Website` table. All the data in the column will be lost.
  - You are about to drop the column `shareId` on the `Website` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pageview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebSession` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[domain]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_websiteId_fkey";

-- DropForeignKey
ALTER TABLE "Pageview" DROP CONSTRAINT "Pageview_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Pageview" DROP CONSTRAINT "Pageview_websiteId_fkey";

-- DropForeignKey
ALTER TABLE "WebSession" DROP CONSTRAINT "WebSession_websiteId_fkey";

-- DropIndex
DROP INDEX "Website_domain_idx";

-- DropIndex
DROP INDEX "Website_shareId_key";

-- AlterTable
ALTER TABLE "Website" DROP COLUMN "public",
DROP COLUMN "shareId";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Pageview";

-- DropTable
DROP TABLE "WebSession";

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "referrer" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "country" TEXT,
    "websiteId" TEXT NOT NULL,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_websiteId_idx" ON "PageView"("websiteId");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Website_domain_key" ON "Website"("domain");

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
