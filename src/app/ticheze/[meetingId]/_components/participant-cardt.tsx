"use client";

import { Card } from "~/components/ui/card";
import { useParticipant, VideoPlayer } from "@videosdk.live/react-sdk";
import { useRef, useEffect } from "react";
import { meetingState$ } from "./meeting-store";

export function ParticipantCard({ participantId }: { participantId: string }) {
  const micRef = useRef<HTMLAudioElement>(null);
  const { micStream, micOn, isLocal, displayName, webcamOn } =
    useParticipant(participantId);

  // Sync VideoSDK state with Legend-State for local participant
  useEffect(() => {
    if (isLocal) {
      meetingState$.localParticipant.micOn.set(micOn);
      meetingState$.localParticipant.webcamOn.set(webcamOn);
    }
  }, [micOn, webcamOn, isLocal]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error),
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);
  return (
    <Card className="bg-secondary border-border group relative aspect-video overflow-hidden rounded-lg">
      {/* Mic audio */}
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />

      {/* Status text (participant, webcam, mic) */}
      <div className="bg-background/70 text-foreground absolute top-3 left-3 z-10 rounded px-2 py-1 text-xs backdrop-blur">
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </div>

      {/* Video or placeholder */}
      {webcamOn ? (
        <VideoPlayer
          participantId={participantId}
          type="video"
          containerStyle={{ height: "100%", width: "100%" }}
          className="h-full w-full"
          classNameVideo="h-full"
          videoStyle={{}}
        />
      ) : (
        <div className="from-secondary to-muted flex h-full w-full items-center justify-center bg-gradient-to-br">
          <div className="text-center">
            <div className="bg-primary/20 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
              <span className="text-2xl">👤</span>
            </div>
            <p className="text-foreground font-semibold">{displayName}</p>
          </div>
        </div>
      )}

      {/* Name Badge */}
      <div className="absolute right-3 bottom-3 left-3">
        <p className="text-foreground truncate text-sm font-medium">
          {displayName}
        </p>
      </div>
    </Card>
  );
}
