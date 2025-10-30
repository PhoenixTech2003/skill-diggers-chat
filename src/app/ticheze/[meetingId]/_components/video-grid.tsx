"use client";
import { useMeeting } from "@videosdk.live/react-sdk";
import { ParticipantCard } from "./participant-cardt";

export function VideoGrid() {
  const { participants } = useMeeting();

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="grid auto-rows-max grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {[...participants.keys()].map((participantId) => (
          <ParticipantCard key={participantId} participantId={participantId} />
        ))}
      </div>
    </div>
  );
}
