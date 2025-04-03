import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/server/db";

type Payload = {
  websiteId: string;
  url: string;
  referrer?: string;
  browser?: string;
  os?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { websiteId, url, referrer, browser, os } =
      (await req.json()) as Payload;
    const website = await db.website.findUnique({ where: { id: websiteId } });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    await db.pageView.create({
      data: {
        websiteId,
        url,
        referrer,
        browser,
        os,
        country: null,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 400 },
    );
  }
}
