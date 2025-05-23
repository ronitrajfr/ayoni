/*
  Warnings:

  - A unique constraint covering the columns `[ip,websiteId]` on the table `UniqueVisitorLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UniqueVisitorLog_ip_websiteId_key" ON "UniqueVisitorLog"("ip", "websiteId");
