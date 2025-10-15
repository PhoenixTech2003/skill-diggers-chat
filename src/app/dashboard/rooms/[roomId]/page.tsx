import { Suspense } from "react";
import { RoomInterface } from "./_components/room-interface";
import { LoadingSkeleton } from "./_components/loading-skeleton";
interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RoomInterface roomId={roomId} />
    </Suspense>
  );
}
