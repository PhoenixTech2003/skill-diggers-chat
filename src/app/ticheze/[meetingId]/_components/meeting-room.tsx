"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { MeetingHeader } from "./meeting-header";
import { VideoGrid } from "./video-grid";

interface MeetingRoomProps {
  meetingId: string;
}

export function MeetingRoom({ meetingId }: MeetingRoomProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  return (
    <div className="bg-background flex h-screen flex-col">
      {/* Header */}
      <MeetingHeader meetingId={meetingId} />

      {/* Main Content */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Video Grid */}
        <div className="flex flex-1 flex-col">
          <VideoGrid />

          {/* Controls */}
          <div className="bg-card border-border fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform items-center justify-center gap-3 rounded-full border px-6 py-3 shadow-lg">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant={isMuted ? "destructive" : "outline"}
              className={`h-10 w-10 rounded-full p-0 ${
                isMuted
                  ? "bg-destructive hover:bg-destructive/90"
                  : "border-border hover:bg-secondary"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔇" : "🎤"}
            </Button>

            <Button
              onClick={() => setIsVideoOn(!isVideoOn)}
              variant={!isVideoOn ? "destructive" : "outline"}
              className={`h-10 w-10 rounded-full p-0 ${
                !isVideoOn
                  ? "bg-destructive hover:bg-destructive/90"
                  : "border-border hover:bg-secondary"
              }`}
              title={isVideoOn ? "Stop video" : "Start video"}
            >
              {isVideoOn ? "📹" : "📹‍"}
            </Button>

            <Button
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90 rounded-full px-6"
            >
              Leave
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
