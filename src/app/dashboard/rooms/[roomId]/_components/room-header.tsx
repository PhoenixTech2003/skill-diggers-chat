"use client";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Hash, LogOut } from "lucide-react";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RoomHeader({ roomId }: { roomId: string }) {
  const leaveRoom = useMutation(api.rooms.leaveRoom);
  const router = useRouter();
  const roomQueryData = useQuery(api.rooms.getRoomDetails, {
    roomId: roomId as Id<"room">,
  });
  if (!roomQueryData) {
    return null;
  }
  async function handleLeaveRoom() {
    toast.promise(leaveRoom({ roomId: roomId as Id<"room"> }), {
      loading: "Leaving room...",
      success: () => {
        router.push("/dashboard");
        return "Room left";
      },
      error: "Failed to leave room",
    });
  }
  return (
    <div className="border-border bg-card sticky top-0 z-10 flex h-16 items-center justify-between border-b px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Hash className="text-primary h-5 w-5" />
          <h1 className="text-card-foreground text-xl font-semibold">
            {roomQueryData.roomData?.details?.name}
          </h1>
          <Badge variant="secondary" className="text-xs">
            {roomQueryData.roomData?.members} members
          </Badge>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="destructive" size="sm" onClick={handleLeaveRoom}>
          <LogOut className="h-4 w-4" />
          <span>Leave</span>
        </Button>
      </div>
    </div>
  );
}
