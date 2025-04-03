-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "shareId" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebSession" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "screen" TEXT,
    "language" TEXT,
    "country" TEXT,
    "subdivision" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "websiteId" TEXT NOT NULL,

    CONSTRAINT "WebSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pageview" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "referrer" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "websiteId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "Pageview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "websiteId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Website_shareId_key" ON "Website"("shareId");

-- CreateIndex
CREATE INDEX "Website_userId_idx" ON "Website"("userId");

-- CreateIndex
CREATE INDEX "Website_domain_idx" ON "Website"("domain");

-- CreateIndex
CREATE INDEX "WebSession_sessionId_idx" ON "WebSession"("sessionId");

-- CreateIndex
CREATE INDEX "WebSession_websiteId_idx" ON "WebSession"("websiteId");

-- CreateIndex
CREATE INDEX "WebSession_createdAt_idx" ON "WebSession"("createdAt");

-- CreateIndex
CREATE INDEX "Pageview_websiteId_idx" ON "Pageview"("websiteId");

-- CreateIndex
CREATE INDEX "Pageview_sessionId_idx" ON "Pageview"("sessionId");

-- CreateIndex
CREATE INDEX "Pageview_createdAt_idx" ON "Pageview"("createdAt");

-- CreateIndex
CREATE INDEX "Pageview_url_idx" ON "Pageview"("url");

-- CreateIndex
CREATE INDEX "Event_websiteId_idx" ON "Event"("websiteId");

-- CreateIndex
CREATE INDEX "Event_sessionId_idx" ON "Event"("sessionId");

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "Event"("createdAt");

-- CreateIndex
CREATE INDEX "Event_name_idx" ON "Event"("name");

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebSession" ADD CONSTRAINT "WebSession_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pageview" ADD CONSTRAINT "Pageview_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pageview" ADD CONSTRAINT "Pageview_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WebSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WebSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
