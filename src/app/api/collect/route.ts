import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/server/db";
import { headers } from "next/headers";

type Payload = {
  websiteId: string;
  url: string;
  referrer?: string;
  browser?: string;
  os?: string;
};

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "unknown";

    const text = await req.text();
    const { websiteId, url, referrer, browser, os } = JSON.parse(
      text,
    ) as Payload;

    if (!websiteId || !url) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const website = await db.website.findUnique({ where: { id: websiteId } });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }
    const websiteUrl = website.domain;
    const NewUrl = new URL(url);
    console.log(NewUrl.host);
    console.log(websiteUrl);
    if (websiteUrl !== NewUrl.host) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await db.pageView.create({
      data: {
        ip: ip !== "unknown" ? ip : null,
        websiteId,
        url,
        referrer,
        browser,
        os,
        country: null,
      },
    });

    if (ip !== "unknown") {
      const existingVisitor = await db.uniqueVisitorLog.findUnique({
        where: {
          ip_websiteId: {
            ip,
            websiteId,
          },
        },
      });
      if (!existingVisitor) {
        await db.uniqueVisitorLog.create({
          data: {
            ip,
            websiteId,
            url,
            referrer,
            browser,
            os,
            country: null,
          },
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 400 },
    );
  }
}
