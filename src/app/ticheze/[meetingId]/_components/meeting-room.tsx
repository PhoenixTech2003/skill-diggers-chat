"use client";

import { useEffect } from "react";
import { MeetingHeader } from "./meeting-header";
import { VideoGrid } from "./video-grid";
import { useMeeting } from "@videosdk.live/react-sdk";
import { MeetingControls } from "./meeting-controls";

interface MeetingRoomProps {
  meetingId: string;
}

export function MeetingRoom({ meetingId }: MeetingRoomProps) {
  const { join } = useMeeting();

  useEffect(() => {
    join();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures join() is called only once on mount
  return (
    <div className="bg-background flex h-screen flex-col">
      {/* Header */}
      <MeetingHeader meetingId={meetingId} />

      {/* Main Content */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Video Grid */}
        <div className="flex flex-1 flex-col">
          <VideoGrid />
        </div>
        <MeetingControls />
      </div>
    </div>
  );
}
