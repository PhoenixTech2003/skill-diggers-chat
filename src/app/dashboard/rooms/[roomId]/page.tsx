import { Suspense } from "react";
import { RoomInterface } from "./_components/room-interface";
import { LoadingSkeleton } from "./_components/loading-skeleton";

interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RoomInterface roomId={id} />
    </Suspense>
  );
}
