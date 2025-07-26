import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { redis } from "@/utils/redis";
import { getRateLimiter } from "@/utils/rate-limit";
import { getIp } from "@/utils/getIP";
import { headers } from "next/headers";

// GET - Fetch all websites for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = `websites:${session.user.id}`;

    const cachedData: string | null = await redis.get(token);

    if (cachedData) {
      return NextResponse.json({ websites: JSON.parse(cachedData) });
    }

    const websites = await db.website.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    await redis.set(token, JSON.stringify(websites), { ex: 300 });

    return NextResponse.json({ websites }, { status: 200 });
  } catch (error) {
    console.error("Error fetching websites:", error);
    return NextResponse.json(
      { error: "Failed to fetch websites" },
      { status: 500 },
    );
  }
}

// POST - Create a new website
export async function POST(req: NextRequest) {
  try {
    const header = await headers();

    const limiter = getRateLimiter("early-access-waitlist");
    if (limiter) {
      const ip = getIp(header);
      const { success } = await limiter.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 },
        );
      }
    }

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = `websites:${session.user.id}`;

    const { name, domain } = await req.json();

    if (!name || !domain) {
      return NextResponse.json(
        { error: "Name and domain are required" },
        { status: 400 },
      );
    }

    // Check if domain already exists
    const existingWebsite = await db.website.findUnique({
      where: { domain },
    });

    if (existingWebsite) {
      return NextResponse.json(
        { error: "Domain already exists" },
        { status: 400 },
      );
    }

    const website = await db.website.create({
      data: {
        name,
        domain,
        userId: session.user.id,
      },
    });

    await redis.del(token);

    return NextResponse.json({ website }, { status: 201 });
  } catch (error) {
    console.error("Error creating website:", error);
    return NextResponse.json(
      { error: "Failed to create website" },
      { status: 500 },
    );
  }
}
