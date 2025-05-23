"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export async function createWebsite(website: { name: string; domain: string }) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existingWebsite = await db.website.findUnique({
    where: { domain: website.domain },
  });

  if (existingWebsite) {
    return { error: "Website already exists" };
  }

  const newWebsite = await db.website.create({
    data: {
      name: website.name,
      domain: website.domain,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");

  return {
    success: true,
    website: {
      id: newWebsite.id,
      name: newWebsite.name,
      domain: newWebsite.domain,
    },
  };
}

export async function deleteWebsite(id: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db.website.delete({
    where: { id, userId: session.user.id },
  });

  return { success: true };
}
