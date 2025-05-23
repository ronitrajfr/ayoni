import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function WebsiteList() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/")
  }

  const websites = await db.website.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    websites.length === 0 ? (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          No websites found. Add your first website to get started.
        </p>
      </div>
    ) : (
      <table className="w-full text-left">
        <thead className="text-muted-foreground border-b text-sm">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Domain</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {websites.map((website) => (
            <tr key={website.id} className="border-b">
              <td className="px-4 py-4">{website.name}</td>
              <td className="px-4 py-4">{website.domain}</td>
              <td className="px-4 py-4 text-right">
                <Link href={`/dashboard/${website.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
}

export const WebsiteListSkeleton = () => {
  return (
    <div className="w-full">
      <div className="w-full text-left">
        <div className="border-b">
          <div className="flex px-4 py-3">
            <div className="w-1/3 h-5 bg-muted animate-pulse rounded"></div>
            <div className="w-1/3 h-5 bg-muted animate-pulse rounded mx-4"></div>
            <div className="w-1/3 h-5 bg-muted animate-pulse rounded ml-auto"></div>
          </div>
        </div>
        <div className="divide-y">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center px-4 py-4">
              <div className="w-1/4 h-5 bg-muted animate-pulse rounded"></div>
              <div className="w-1/3 h-5 bg-muted animate-pulse rounded mx-4"></div>
              <div className="ml-auto">
                <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}