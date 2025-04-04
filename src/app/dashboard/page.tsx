"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Website {
  id: string;
  name: string;
  domain: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newWebsite, setNewWebsite] = useState({ name: "", domain: "" });

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/website");
      const data = await response.json();

      if (response.ok) {
        setWebsites(data.websites);
      } else {
        toast.error(data.error || "Failed to fetch websites");
      }
    } catch (error) {
      toast.error("An error occurred while fetching websites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWebsite),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Website created successfully");
        setNewWebsite({ name: "", domain: "" });
        setOpen(false);
        fetchWebsites();
      } else {
        toast.error(data.error || "Failed to create website");
      }
    } catch (error) {
      toast.error("An error occurred while creating the website");
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Websites</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Website
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Website</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateWebsite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newWebsite.name}
                  onChange={(e) =>
                    setNewWebsite({ ...newWebsite, name: e.target.value })
                  }
                  placeholder="My Website"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={newWebsite.domain}
                  onChange={(e) =>
                    setNewWebsite({ ...newWebsite, domain: e.target.value })
                  }
                  placeholder="example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Website
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : websites.length === 0 ? (
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
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
