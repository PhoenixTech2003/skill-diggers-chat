"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { joinRoomAction } from "~/server/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RoomCardProps = {
  id: string;
  name: string;
  createdAt: Date;
  isMember: boolean;
};

export function RoomCard({ id, name, createdAt, isMember }: RoomCardProps) {
  const router = useRouter();
  async function handleJoinRoom() {
    toast.promise(joinRoomAction({ roomId: id }), {
      loading: "Joining room...",
      success: () => {
        router.refresh();
        router.push(`/dashboard/rooms/${id}`);
        return "Joined room";
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
            Created {createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="shrink-0">
          {isMember ? (
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
