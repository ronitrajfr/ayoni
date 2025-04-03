import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

// GET - Fetch all websites for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const websites = await db.website.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

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
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return NextResponse.json({ website }, { status: 201 });
  } catch (error) {
    console.error("Error creating website:", error);
    return NextResponse.json(
      { error: "Failed to create website" },
      { status: 500 },
    );
  }
}
