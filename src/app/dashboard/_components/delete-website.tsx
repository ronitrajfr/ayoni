"use client";

import { Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteWebsite } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteWebsite({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteWebsite(id);
      toast.success("Website deleted successfully");
      setOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete website");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={deleting}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Website
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Website</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this website? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Website
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}