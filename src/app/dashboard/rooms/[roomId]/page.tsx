import { Suspense } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { RoomInterface } from "./_components/room-interface";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { LoadingSkeleton } from "./_components/loading-skeleton";
import { getToken } from "~/lib/auth-server";
interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;
  const exists = await fetchQuery(api.rooms.roomExists, { roomId });
  if (!exists) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <Card className="bg-card text-card-foreground w-full max-w-lg border">
          <CardContent className="space-y-4 p-6 text-center">
            <h1 className="text-2xl font-semibold">Room not found</h1>
            <p className="text-muted-foreground">
              The room you’re looking for doesn’t exist or may have been
              deleted.
            </p>
            <Button asChild>
              <Link href="/dashboard/">Go back to rooms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  const token = await getToken();
  const isMember: boolean = await fetchQuery(
    api.rooms.checkMembership,
    { roomId: roomId as Id<"room"> },
    { token },
  );
  if (!isMember) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <Card className="bg-card text-card-foreground w-full max-w-lg border">
          <CardContent className="space-y-4 p-6 text-center">
            <h1 className="text-2xl font-semibold">Access denied</h1>
            <p className="text-muted-foreground">
              You aren’t a member of this room.
            </p>
            <Button asChild>
              <Link href="/dashboard/">Browse rooms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RoomInterface roomId={roomId} />
    </Suspense>
  );
}
