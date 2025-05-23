-- AlterTable
ALTER TABLE "PageView" ADD COLUMN     "ip" TEXT;

-- CreateTable
CREATE TABLE "UniqueVisitorLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "referrer" TEXT,
    "ip" TEXT NOT NULL,
    "browser" TEXT,
    "os" TEXT,
    "country" TEXT,
    "websiteId" TEXT NOT NULL,

    CONSTRAINT "UniqueVisitorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UniqueVisitorLog_websiteId_idx" ON "UniqueVisitorLog"("websiteId");

-- CreateIndex
CREATE INDEX "UniqueVisitorLog_createdAt_idx" ON "UniqueVisitorLog"("createdAt");

-- CreateIndex
CREATE INDEX "UniqueVisitorLog_websiteId_createdAt_idx" ON "UniqueVisitorLog"("websiteId", "createdAt");

-- AddForeignKey
ALTER TABLE "UniqueVisitorLog" ADD CONSTRAINT "UniqueVisitorLog_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
