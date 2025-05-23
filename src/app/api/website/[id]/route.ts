import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const websiteId = params.id;

    const website = await db.website.findFirst({
      where: {
        id: websiteId,
        userId: session.user.id,
      },
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "7d";

    const now = new Date();
    let startDate = new Date();

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
      recentPageViews,
      totalUniqueVisitors,
    ] = await Promise.all([
      db.pageView.count({
        where: {
          websiteId,
          createdAt: { gte: startDate, lte: now },
        },
      }),

      db.pageView.groupBy({
        by: ["url"],
        where: {
          websiteId,
          createdAt: { gte: startDate, lte: now },
        },
        _count: { url: true },
        orderBy: { _count: { url: "desc" } },
        take: 10,
      }),

      db.pageView.groupBy({
        by: ["referrer"],
        where: {
          websiteId,
          createdAt: { gte: startDate, lte: now },
          referrer: { not: null },
        },
        _count: { referrer: true },
        orderBy: { _count: { referrer: "desc" } },
      }),

      db.pageView.groupBy({
        by: ["browser"],
        where: {
          websiteId,
          createdAt: { gte: startDate, lte: now },
        },
        _count: { browser: true },
        orderBy: { _count: { browser: "desc" } },
      }),

      db.pageView.groupBy({
        by: ["os"],
        where: {
          websiteId,
          createdAt: { gte: startDate, lte: now },
        },
        _count: { os: true },
        orderBy: { _count: { os: "desc" } },
      }),

      db.pageView.findMany({
        where: {
          websiteId,
          createdAt: { gte: startDate, lte: now },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),

      db.uniqueVisitorLog.count({
        where: {
          websiteId,
          createdAt: { gte: startDate, lte: now },
        },
      }),
    ]);

    return NextResponse.json(
      {
        website,
        analytics: {
          period,
          totalPageViews,
          totalUniqueVisitors,
          uniqueUrlsCount: topUrls.length,
          topUrls: topUrls.map((u) => ({
            url: u.url,
            count: u._count.url,
          })),
          referrers: Object.fromEntries(
            referrerStats.map((r) => [
              r.referrer ?? "direct",
              r._count.referrer,
            ]),
          ),
          browsers: Object.fromEntries(
            browserStats.map((b) => [b.browser ?? "unknown", b._count.browser]),
          ),
          operatingSystems: Object.fromEntries(
            osStats.map((o) => [o.os ?? "unknown", o._count.os]),
          ),
        },
        recentPageViews,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching website analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch website analytics" },
      { status: 500 },
    );
  }
}
