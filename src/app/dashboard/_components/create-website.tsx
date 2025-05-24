"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
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
import { websiteSchema } from "@/lib/schema";
import { createWebsite } from "@/actions";

export default function CreateWebsite() {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }
  const [open, setOpen] = useState(false);
  const [newWebsite, setNewWebsite] = useState({ name: "", domain: "" });
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    domain?: string;
  }>({});

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const validationResult = websiteSchema.safeParse(newWebsite);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      setValidationErrors({
        name: errors.name?.[0],
        domain: errors.domain?.[0],
      });
      return;
    }

    try {
      const response = await createWebsite(newWebsite);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Website created successfully");
        setNewWebsite({ name: "", domain: "" });
        setOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while creating the website");
    }
  };

  return (
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
            {validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name}</p>
            )}
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
            {validationErrors.domain && (
              <p className="text-sm text-red-500">{validationErrors.domain}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Create Website
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
