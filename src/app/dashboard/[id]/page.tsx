import { auth } from "@/server/auth";
import { db } from "@/server/db";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Globe } from "lucide-react";
import WebsiteDetails from "../_components/website-details";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import DeleteWebsite from "../_components/delete-website";
import { AnalyticsSkeleton, WebsiteAnalytics } from "../_components/analytics";
import { Suspense } from "react";
import { AnalyticsFilter } from "../_components/analytics-filter";

export default async function WebsiteDetailPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const awaitedSearchParams = await searchParams;
  const period =
    typeof awaitedSearchParams.period === "string"
      ? awaitedSearchParams.period
      : "24h";

  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const website = await db.website.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!website) {
    return notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="relative mb-8 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-[120%] -left-10 w-fit"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Websites
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{website?.name}</h1>
        <DeleteWebsite id={website.id} />
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="mb-8">
          <TabsTrigger value="settings">
            <Globe className="mr-2 h-4 w-4" />
            Website Settings
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <WebsiteDetails {...website} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsFilter id={website.id} period={period} />
          <Suspense key={period} fallback={<AnalyticsSkeleton />}>
            <WebsiteAnalytics website={website} period={period} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
