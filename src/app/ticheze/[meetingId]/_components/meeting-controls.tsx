"use client";

import { useMeeting } from "@videosdk.live/react-sdk";
import { VideoIcon, VideoOff, Mic, MicOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import { meetingState$ } from "./meeting-store";
import { useObservable } from "@legendapp/state/react";

export function MeetingControls() {
  const { toggleMic, toggleWebcam, leave } = useMeeting();

  const micOn = useObservable(meetingState$.localParticipant.micOn);
  const webcamOn = useObservable(meetingState$.localParticipant.webcamOn);

  const handleToggleMic = () => {
    toggleMic();
    meetingState$.localParticipant.micOn.set(!micOn.get());
  };

  const handleToggleWebcam = () => {
    toggleWebcam();
    meetingState$.localParticipant.webcamOn.set(!webcamOn.get());
  };

  return (
    <div className="bg-card border-border fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform items-center justify-center gap-3 rounded-full border px-6 py-3 shadow-lg">
      <Button
        onClick={handleToggleMic}
        variant={!micOn.get() ? "destructive" : "outline"}
        className={`h-10 w-10 rounded-full p-0 ${
          !micOn.get()
            ? "bg-destructive hover:bg-destructive/90"
            : "border-border hover:bg-secondary"
        }`}
        title={micOn.get() ? "Mute" : "Unmute"}
      >
        {!micOn.get() ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      <Button
        onClick={handleToggleWebcam}
        variant={!webcamOn.get() ? "destructive" : "outline"}
        className={`h-10 w-10 rounded-full p-0 ${
          !webcamOn.get()
            ? "bg-destructive hover:bg-destructive/90"
            : "border-border hover:bg-secondary"
        }`}
        title={webcamOn.get() ? "Stop video" : "Start video"}
      >
        {webcamOn.get() ? (
          <VideoIcon className="h-4 w-4" />
        ) : (
          <VideoOff className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="destructive"
        className="bg-destructive hover:bg-destructive/90 rounded-full px-6"
        onClick={leave}
      >
        Leave
      </Button>
    </div>
  );
}
