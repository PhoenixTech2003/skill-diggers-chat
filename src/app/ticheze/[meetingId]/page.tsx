import { Suspense } from "react";
import { MeetingRoom } from "./_components/meeting-room";
import { MeetingRoomLoading } from "./_components/loading-skeleton";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;
  return (
    <main className="bg-background min-h-screen">
      <Suspense fallback={<MeetingRoomLoading />}>
        <MeetingRoom meetingId={meetingId} />
      </Suspense>
    </main>
  );
}
