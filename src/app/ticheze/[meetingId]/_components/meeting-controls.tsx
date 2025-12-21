"use client";

import { useMeeting } from "@videosdk.live/react-sdk";
import { VideoIcon, VideoOff, Mic, MicOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export function MeetingControls() {
  const { localMicOn, localWebcamOn, toggleMic, toggleWebcam, leave } =
    useMeeting();
  const { meetingId } = useParams<{ meetingId: string }>();
  const setVideoParticipantLeft = useMutation(
    api.videoRooms.setVideoParticipantLeft,
  );

  return (
    <div className="bg-card border-border fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform items-center justify-center gap-3 rounded-full border px-6 py-3 shadow-lg">
      <Button
        onClick={() => toggleMic()}
        variant={!localMicOn ? "destructive" : "outline"}
        className={`h-10 w-10 rounded-full p-0 ${
          !localMicOn
            ? "bg-destructive hover:bg-destructive/90"
            : "border-border hover:bg-secondary"
        }`}
        title={localMicOn ? "Mute" : "Unmute"}
      >
        {!localMicOn ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      <Button
        onClick={() => toggleWebcam()}
        variant={!localWebcamOn ? "destructive" : "outline"}
        className={`h-10 w-10 rounded-full p-0 ${
          !localWebcamOn
            ? "bg-destructive hover:bg-destructive/90"
            : "border-border hover:bg-secondary"
        }`}
        title={localWebcamOn ? "Stop video" : "Start video"}
      >
        {localWebcamOn ? (
          <VideoIcon className="h-4 w-4" />
        ) : (
          <VideoOff className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="destructive"
        className="bg-destructive hover:bg-destructive/90 rounded-full px-6"
        onClick={async () => {
          try {
            if (meetingId) {
              await setVideoParticipantLeft({ videosdkRoomId: meetingId });
            }
          } finally {
            leave();
          }
        }}
      >
        Leave
      </Button>
    </div>
  );
}
