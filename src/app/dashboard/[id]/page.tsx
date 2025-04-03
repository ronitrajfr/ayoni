"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Clipboard, BarChart, Globe } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Website {
  id: string;
  name: string;
  domain: string;
}

interface Analytics {
  period: string;
  totalPageViews: number;
  uniqueUrlsCount: number;
  topUrls: { url: string; count: number }[];
  referrers: Record<string, number>;
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
}

interface PageView {
  id: string;
  url: string;
  referrer: string | null;
  browser: string;
  os: string;
  createdAt: string;
}

const WebsiteDetailPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const params = useParams();
  const websiteId = params.id as string;

  const [website, setWebsite] = useState<Website | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentPageViews, setRecentPageViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");

  const fetchWebsiteData = async (selectedPeriod = period) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/website/${websiteId}?period=${selectedPeriod}`,
      );
      const data = await response.json();

      if (response.ok) {
        setWebsite(data.website);
        setAnalytics(data.analytics);
        setRecentPageViews(data.recentPageViews);
      } else {
        toast.error(data.error || "Failed to fetch website data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching website data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsiteData();
  }, [websiteId]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    fetchWebsiteData(newPeriod);
  };

  const copyTrackingCode = () => {
    const code = `<script async src="http://localhost:3000/tracker.js" data-website-id="${websiteId}"></script>`;
    navigator.clipboard.writeText(code);
    toast.success("Tracking code copied to clipboard");
  };

  const deleteWebsite = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this website? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/website/${websiteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Website deleted successfully");
        window.location.href = "/dashboard";
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete website");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the website");
    }
  };

  // Helper function to safely extract hostname from URL
  const getHostFromUrl = (url: string) => {
    if (!url || url === "direct") return "Direct";

    try {
      // Check if the URL has a protocol, add one if missing
      const urlWithProtocol = url.startsWith("http") ? url : `http://${url}`;
      return new URL(urlWithProtocol).host;
    } catch (e) {
      // If URL parsing fails, return the original string
      return url;
    }
  };

  // Helper function to simplify page paths
  const getSimplePath = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname || url;
    } catch (e) {
      // If it's not a valid URL, just return the original
      return url;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl py-8">
        <div className="mb-8 flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Websites
            </Button>
          </Link>
        </div>
        <div className="py-8 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Websites
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{website?.name}</h1>
        </div>
        <Button variant="destructive" onClick={deleteWebsite}>
          Delete Website
        </Button>
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
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-1 font-medium">Name</h3>
                    <p>{website?.name}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 font-medium">Domain</h3>
                    <p>{website?.domain}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Code</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Add this code to the <code>&lt;head&gt;</code> section of your
                  website to start tracking visitors.
                </p>
                <div className="bg-muted mb-4 overflow-x-auto rounded-md p-4 font-mono text-sm">
                  {`<script async src="http://localhost:3000/tracker.js" data-website-id="${websiteId}"></script>`}
                </div>
                <Button onClick={copyTrackingCode}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="mb-6">
            <div className="mb-6 flex gap-2">
              <Button
                variant={period === "24h" ? "default" : "outline"}
                onClick={() => handlePeriodChange("24h")}
              >
                24 Hours
              </Button>
              <Button
                variant={period === "7d" ? "default" : "outline"}
                onClick={() => handlePeriodChange("7d")}
              >
                7 Days
              </Button>
              <Button
                variant={period === "30d" ? "default" : "outline"}
                onClick={() => handlePeriodChange("30d")}
              >
                30 Days
              </Button>
              <Button
                variant={period === "90d" ? "default" : "outline"}
                onClick={() => handlePeriodChange("90d")}
              >
                90 Days
              </Button>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground text-sm font-medium">
                    Total Page Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analytics?.totalPageViews || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground text-sm font-medium">
                    Unique Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analytics?.uniqueUrlsCount || 0}
                  </div>
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
                    {analytics?.uniqueUrlsCount
                      ? Math.round(
                          analytics.totalPageViews / analytics.uniqueUrlsCount,
                        )
                      : 0}
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
                  {analytics?.topUrls && analytics.topUrls.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.topUrls.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="max-w-[300px] truncate">
                            {getSimplePath(item.url) || "/"}
                          </div>
                          <div className="font-medium">{item.count}</div>
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
                  {analytics?.referrers &&
                  Object.keys(analytics.referrers).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(analytics.referrers)
                        .sort((a, b) => b[1] - a[1])
                        .map(([referrer, count], index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="max-w-[300px] truncate">
                              {getHostFromUrl(referrer)}
                            </div>
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
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Browsers</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.browsers &&
                  Object.keys(analytics.browsers).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(analytics.browsers)
                        .sort((a, b) => b[1] - a[1])
                        .map(([browser, count], index) => (
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
                  {analytics?.operatingSystems &&
                  Object.keys(analytics.operatingSystems).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(analytics.operatingSystems)
                        .sort((a, b) => b[1] - a[1])
                        .map(([os, count], index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div>{os}</div>
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
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                {recentPageViews && recentPageViews.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-muted-foreground border-b text-left text-sm">
                          <th className="pr-4 pb-2">URL</th>
                          <th className="pr-4 pb-2">Referrer</th>
                          <th className="pr-4 pb-2">Browser</th>
                          <th className="pr-4 pb-2">OS</th>
                          <th className="pb-2">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPageViews.map((view) => (
                          <tr key={view.id} className="border-b">
                            <td className="max-w-[200px] truncate py-3 pr-4">
                              {getSimplePath(view.url)}
                            </td>
                            <td className="max-w-[150px] truncate py-3 pr-4">
                              {view.referrer
                                ? getHostFromUrl(view.referrer)
                                : "Direct"}
                            </td>
                            <td className="py-3 pr-4">{view.browser}</td>
                            <td className="py-3 pr-4">{view.os}</td>
                            <td className="py-3">
                              {new Date(view.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-muted-foreground py-4 text-center">
                    No recent page views
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteDetailPage;
