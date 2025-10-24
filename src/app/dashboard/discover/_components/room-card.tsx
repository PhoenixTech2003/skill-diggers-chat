"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { type Id } from "convex/_generated/dataModel";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";

type RoomCardProps = {
  id: Id<"room">;
  name: string;
  createdAt: string | Date;
};

export function RoomCard({ id, name, createdAt }: RoomCardProps) {
  const isMember = useQuery(api.rooms.checkMembership, {
    roomId: id,
  });
  const joinRoom = useMutation(api.rooms.joinRoom);
  const createdDate = new Date(createdAt);
  async function handleJoinRoom() {
    toast.promise(joinRoom({ roomId: id }), {
      loading: "Joining room...",
      success: (roomDetails) => {
        return `Room ${roomDetails?.name} joined`;
      },
      error: "Failed to join room",
    });
  }

  return (
    <Card className="bg-card overflow-hidden border">
      <div className="bg-muted flex items-center justify-center p-8">
        <Code2 className="text-primary h-12 w-12" />
      </div>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base leading-tight font-semibold">
            {name}
          </h3>
          <p className="text-muted-foreground mt-1 text-xs">
            Created {createdDate.toLocaleDateString()}
          </p>
        </div>
        <div className="shrink-0">
          {isMember === undefined ? (
            <Skeleton className="h-9 w-24" />
          ) : isMember ? (
            <Button asChild>
              <Link href={`/dashboard/rooms/${id}`}>Go to room</Link>
            </Button>
          ) : (
            <Button onClick={handleJoinRoom}>Join</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
