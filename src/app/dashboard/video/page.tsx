"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  VideoPlayer,
} from "@videosdk.live/react-sdk";
import { createMeeting } from "~/server/actions";

async function getVideoSdkToken() {
  const res = await fetch("/api/video-sdk/get-token", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to get VideoSDK token");
  const data: { token?: string } = await res.json();
  if (!data.token) throw new Error("VideoSDK token missing");
  return data.token;
}

function JoinScreen({
  onReady,
}: {
  onReady: (args: { meetingId: string; token: string }) => void;
}) {
  const [meetingId, setMeetingId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const [token, newMeetingId] = await Promise.all([
        getVideoSdkToken(),
        createMeeting(),
      ]);
      onReady({ meetingId: newMeetingId, token });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getVideoSdkToken();
      onReady({ meetingId: meetingId.trim(), token });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to join meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Video call</h1>
      <p className="text-muted-foreground text-sm">
        Create a meeting or join an existing meetingId.
      </p>

      {error ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex gap-2">
        <input
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
          placeholder="Enter meetingId"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
        />
        <button
          className="rounded-md border px-3 py-2 text-sm"
          onClick={handleJoin}
          disabled={loading || meetingId.trim().length === 0}
          type="button"
        >
          Join
        </button>
      </div>

      <button
        className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
        onClick={handleCreate}
        disabled={loading}
        type="button"
      >
        {loading ? "Working..." : "Create meeting"}
      </button>

      <div className="text-muted-foreground text-xs">
        Tip: allow camera/microphone permissions when prompted.
      </div>
    </div>
  );
}

function ParticipantView({ participantId }: { participantId: string }) {
  const micRef = useRef<HTMLAudioElement | null>(null);
  const { micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  useEffect(() => {
    if (!micRef.current) return;
    if (micOn && micStream?.track) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      micRef.current.srcObject = mediaStream;
      micRef.current
        .play()
        .catch(() => {
          // Autoplay can be blocked until user interacts; join button is usually enough.
        });
    } else {
      micRef.current.srcObject = null;
    }
  }, [micStream, micOn]);

  return (
    <div className="rounded-md border p-3">
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
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="rounded-md border px-3 py-2 text-sm"
        onClick={() => toggleMic()}
        type="button"
      >
        Toggle mic
      </button>
      <button
        className="rounded-md border px-3 py-2 text-sm"
        onClick={() => toggleWebcam()}
        type="button"
      >
        Toggle webcam
      </button>
      <button
        className="rounded-md border px-3 py-2 text-sm"
        onClick={() => leave()}
        type="button"
      >
        Leave
      </button>
    </div>
  );
}

function MeetingView({ onLeave }: { onLeave: () => void }) {
  const [status, setStatus] = useState<"idle" | "joining" | "joined">("idle");

  const { join, participants } = useMeeting({
    onMeetingJoined: () => setStatus("joined"),
    onMeetingLeft: () => onLeave(),
  });

  const participantIds = useMemo(() => [...participants.keys()], [participants]);

  if (status !== "joined") {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
        <h2 className="text-xl font-semibold">Ready to join</h2>
        <button
          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
          onClick={() => {
            setStatus("joining");
            join();
          }}
          disabled={status === "joining"}
          type="button"
        >
          {status === "joining" ? "Joining..." : "Join meeting"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <Controls />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {participantIds.map((id) => (
          <ParticipantView key={id} participantId={id} />
        ))}
      </div>
    </div>
  );
}

export default function VideoPage() {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  if (!meetingId || !token) {
    return (
      <JoinScreen
        onReady={({ meetingId: id, token: t }) => {
          setMeetingId(id);
          setToken(t);
        }}
      />
    );
  }

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Guest",
        debugMode: false,
      }}
      token={token}
    >
      <MeetingView
        onLeave={() => {
          setMeetingId(null);
          setToken(null);
        }}
      />
    </MeetingProvider>
  );
}









