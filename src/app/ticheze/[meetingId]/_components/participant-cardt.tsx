"use client";

import { Card } from "~/components/ui/card";
import { useParticipant, VideoPlayer } from "@videosdk.live/react-sdk";
import { useRef, useEffect } from "react";

export function ParticipantCard({ participantId }: { participantId: string }) {
  const micRef = useRef<HTMLAudioElement>(null);
  const { micStream, micOn, isLocal, displayName, webcamOn } =
    useParticipant(participantId);

  useEffect(() => {
    if (!micRef.current) return;
    if (micOn && micStream?.track) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      micRef.current.srcObject = mediaStream;
      micRef.current.play().catch(() => {
        // Autoplay can be blocked until user interacts; join button is usually enough.
      });
    } else {
      micRef.current.srcObject = null;
    }
  }, [micStream, micOn]);
  return (
    <Card className="rounded-md border p-3">
      <div className="mb-2 text-sm font-medium">
        {displayName ?? participantId}
      </div>
      <div className="text-muted-foreground mb-2 text-xs">
        Webcam: {webcamOn ? "ON" : "OFF"} • Mic: {micOn ? "ON" : "OFF"}
      </div>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn ? (
        <div className="aspect-video overflow-hidden rounded-md bg-black">
          <VideoPlayer
            participantId={participantId}
            type="video"
            className="h-full"
            classNameVideo="h-full"
          />
        </div>
      ) : null}
    </Card>
  );
}
