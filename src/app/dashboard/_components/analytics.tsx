import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSimplePath, getHostFromUrl } from "@/lib/utils";
import { redirect } from "next/navigation";
import { extractBrowserName } from "@/lib/extract-browser";

type Website = {
  id: string;
  name: string;
  domain: string;
};

export const WebsiteAnalytics = async ({
  website,
  period,
}: {
  website: Website;
  period: string;
}) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case "24h":
      startDate.setHours(now.getHours() - 24);
      break;
    case "30d":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(now.getDate() - 90);
      break;
    default:
      startDate.setDate(now.getDate() - 7);
  }
  const [
    totalPageViews,
    topUrls,
    referrerStats,
    browserStats,
    osStats,
    deviceTypeStats,
    recentPageViews,
    totalUniqueVisitors,
  ] = await Promise.all([
    db.pageView.count({
      where: {
        websiteId: website.id,
        createdAt: { gte: startDate, lte: now },
      },
    }),

    db.pageView.groupBy({
      by: ["url"],
      where: {
        websiteId: website.id,
        createdAt: { gte: startDate, lte: now },
      },
      _count: { url: true },
      orderBy: { _count: { url: "desc" } },
      take: 10,
    }),

    db.pageView.groupBy({
      by: ["referrer"],
      where: {
        websiteId: website.id,
        createdAt: { gte: startDate, lte: now },
        referrer: { not: null },
      },
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
    }),

    db.pageView.groupBy({
      by: ["browser"],
      where: {
        websiteId: website.id,
        createdAt: { gte: startDate, lte: now },
      },
      _count: { browser: true },
      orderBy: { _count: { browser: "desc" } },
    }),

    db.pageView.groupBy({
      by: ["os"],
      where: {
        websiteId: website.id,
        createdAt: { gte: startDate, lte: now },
      },
      _count: { os: true },
      orderBy: { _count: { os: "desc" } },
    }),

    db.pageView.groupBy({
      by: ["deviceType"],
      where: {
        websiteId: website.id,
        createdAt: { gte: startDate, lte: now },
      },
      _count: { deviceType: true },
      orderBy: { _count: { deviceType: "desc" } },
    }),

    db.pageView.findMany({
      where: {
        websiteId: website.id,
        createdAt: { gte: startDate, lte: now },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),

    db.uniqueVisitorLog.count({
      where: {
        websiteId: website.id,
        createdAt: { gte: startDate, lte: now },
      },
    }),
  ]);

  return (
    <div className="mb-6">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPageViews || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUniqueVisitors || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Unique Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{topUrls.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Average Views Per Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {topUrls.length ? Math.round(totalPageViews / topUrls.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>

          <CardContent>
            {topUrls && topUrls.length > 0 ? (
              <div className="space-y-2">
                {topUrls.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="max-w-[300px] truncate">
                      {getSimplePath(item.url) || "/"}
                    </div>

                    <div className="font-medium">{item._count.url}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-4 text-center">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>

          <CardContent>
            {referrerStats && referrerStats.length > 0 ? (
              <div className="space-y-2">
                {referrerStats.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="max-w-[300px] truncate">
                      {getHostFromUrl(item.referrer ?? "direct")}
                    </div>
                    <div className="font-medium">{item._count.referrer}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-4 text-center">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Browsers</CardTitle>
          </CardHeader>

          <CardContent>
            {browserStats && browserStats.length > 0 ? (
              <div className="space-y-2">
                {Object.entries(
                  browserStats.reduce((acc: Record<string, number>, item) => {
                    const name = extractBrowserName(item.browser ?? "");
                    acc[name] = (acc[name] || 0) + item._count.browser;
                    return acc;
                  }, {}),
                ).map(([browser, count], index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>{browser}</div>
                    <div className="font-medium">{count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-4 text-center">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operating Systems</CardTitle>
          </CardHeader>

          <CardContent>
            {osStats && osStats.length > 0 ? (
              <div className="space-y-2">
                {osStats.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>{item.os ?? "unknown"}</div>
                    <div className="font-medium">{item._count.os}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-4 text-center">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(() => {
                const deviceTypes = ["mobile", "tablet", "desktop"];
                return deviceTypes.map((deviceType) => {
                  const stat = deviceTypeStats.find(
                    (item) => item.deviceType?.toLowerCase() === deviceType,
                  );
                  const count = stat?._count.deviceType || 0;

                  return (
                    <div
                      key={deviceType}
                      className="flex items-center justify-between"
                    >
                      <div className="capitalize">{deviceType}</div>
                      <div className="font-medium">{count}</div>
                    </div>
                  );
                });
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const AnalyticsSkeleton = () => {
  return (
    <div className="mb-6">
      <div className="bg-muted mb-4 h-10 w-48 animate-pulse rounded" />

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="bg-muted h-6 w-24 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-8 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="bg-muted h-6 w-28 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-8 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="bg-muted h-6 w-20 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-8 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="bg-muted h-6 w-36 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-8 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="bg-muted h-6 w-24 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-8 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
