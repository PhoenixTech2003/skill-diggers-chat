"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { api } from "../../../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import type { Id } from "convex/_generated/dataModel";

export function DeleteRoomDialog({
  roomId,
  trigger,
}: {
  roomId: Id<"room">;
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const deleteRoom = useMutation(api.rooms.deleteRoom);

  const onDelete = async () => {
    toast.promise(deleteRoom({ roomId }), {
      loading: "Deleting room...",
      success: () => {
        setOpen(false);
        router.refresh();
        return "Room deleted";
      },
      error: "Failed to delete room",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete room</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
