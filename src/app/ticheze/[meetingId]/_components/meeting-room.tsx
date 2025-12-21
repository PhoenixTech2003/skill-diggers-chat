"use client";

import { useState } from "react";
import { MeetingHeader } from "./meeting-header";
import { VideoGrid } from "./video-grid";
import { useMeeting } from "@videosdk.live/react-sdk";
import { MeetingControls } from "./meeting-controls";
import { Button } from "~/components/ui/button";

interface MeetingRoomProps {
  meetingId: string;
}

export function MeetingRoom({ meetingId }: MeetingRoomProps) {
  const [status, setStatus] = useState<"ready" | "joining" | "joined">("ready");

  const { join, participants } = useMeeting({
    onMeetingJoined: () => setStatus("joined"),
    onMeetingLeft: () => setStatus("ready"),
  });

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
        {status === "joined" ? <MeetingControls /> : null}

        {status !== "joined" ? (
          <div className="bg-background/60 absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-card border-border w-full max-w-md rounded-lg border p-6 shadow-lg">
              <h2 className="text-foreground mb-2 text-lg font-semibold">
                Join meeting
              </h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Click join to start your camera and microphone.
              </p>
              <Button
                type="button"
                className="w-full"
                disabled={status === "joining"}
                onClick={() => {
                  setStatus("joining");
                  join();
                }}
              >
                {status === "joining" ? "Joining…" : "Join now"}
              </Button>
              <p className="text-muted-foreground mt-3 text-xs">
                Tip: allow camera/microphone permissions when prompted.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
