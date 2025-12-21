"use client";
import { useMemo } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { ParticipantCard } from "./participant-cardt";

export function VideoGrid() {
  const { participants } = useMeeting();

  // Match dashboard pattern: use participants.keys() directly
  const participantIds = useMemo(() => [...participants.keys()], [participants]);

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="grid auto-rows-max grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {participantIds.map((participantId) => (
          <ParticipantCard key={participantId} participantId={participantId} />
        ))}
      </div>
    </div>
  );
}
