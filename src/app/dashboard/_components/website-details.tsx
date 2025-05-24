"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";
import type { Website } from "@prisma/client";

export default function WebsiteDetails(website: Website) {
  const copyTrackingCode = () => {
    const code = `<script async src="https://ayoni.vercel.app/tracker.js" data-website-id="${website.id}"></script>`;
    navigator.clipboard.writeText(code);
    toast.success("Tracking code copied to clipboard");
  };

  return (
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
            {`<script async src="https://ayoni.vercel.app/tracker.js" data-website-id="${website.id}"></script>`}
          </div>
          <Button onClick={copyTrackingCode}>
            <Clipboard className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}