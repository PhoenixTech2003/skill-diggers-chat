"use client";
import { redirect, useParams } from "next/navigation";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import dynamic from "next/dynamic";

// VideoSDK's react-sdk touches `self` during module evaluation, which breaks when
// Next evaluates the module in a server context. Load it client-side only.
const MeetingProvider = dynamic(
  () =>
    import("@videosdk.live/react-sdk").then(
      (m) => m.MeetingProvider as unknown as React.ComponentType<any>,
    ),
  { ssr: false },
);

async function getVideoSdkToken(args: { roomId: string; peerId?: string }) {
  const url = new URL("/api/video-sdk/get-token", window.location.origin);
  url.searchParams.set("roomId", args.roomId);
  if (args.peerId) url.searchParams.set("peerId", args.peerId);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to get VideoSDK token");
  const data: { token?: string } = await res.json();
  if (!data.token) throw new Error("VideoSDK token missing");
  return data.token;
}
export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { meetingId } = useParams<{ meetingId: string }>();
  const {
    data: session,
    isPending: sessionPending,
    error: sessionError,
  } = authClient.useSession();

  // Hooks must be called in the same order on every render.
  const upsertVideoParticipantActive = useMutation(
    api.videoRooms.upsertVideoParticipantActive,
  );

  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const name = session?.user?.name ?? "Guest";
  const userId =
    (session?.user as unknown as { id?: string; _id?: string } | undefined)?.id ??
    (session?.user as unknown as { id?: string; _id?: string } | undefined)?._id;

  useEffect(() => {
    // Only fetch token once we know we have an authenticated user.
    if (!meetingId || !userId) return;
    let cancelled = false;
    void (async () => {
      try {
        const t = await getVideoSdkToken({ roomId: meetingId, peerId: userId });
        if (!cancelled) setToken(t);
      } catch (e) {
        if (!cancelled) {
          setTokenError(e instanceof Error ? e.message : "Failed to get token");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [meetingId, userId]);

  useEffect(() => {
    if (!meetingId) return;
    void upsertVideoParticipantActive({ videosdkRoomId: meetingId });
  }, [meetingId, upsertVideoParticipantActive]);

  // Important: on a hard refresh / direct navigation, the session starts as
  // "pending" on the client. If we redirect immediately, we bounce logged-in
  // users back to login.
  if (sessionPending) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3 p-6">
        <h1 className="text-xl font-semibold">Loading session…</h1>
        <p className="text-muted-foreground text-sm">
          Verifying your login before joining the meeting.
        </p>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3 p-6">
        <h1 className="text-xl font-semibold">Session error</h1>
        <p className="text-muted-foreground text-sm">
          {sessionError instanceof Error
            ? sessionError.message
            : String(sessionError)}
        </p>
      </div>
    );
  }

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!meetingId) {
    return null;
  }

  if (tokenError) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3 p-6">
        <h1 className="text-xl font-semibold">Unable to join meeting</h1>
        <p className="text-muted-foreground text-sm">{tokenError}</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3 p-6">
        <h1 className="text-xl font-semibold">Preparing meeting…</h1>
        <p className="text-muted-foreground text-sm">
          Fetching secure VideoSDK token.
        </p>
      </div>
    );
  }
  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name,
        debugMode: true,
      }}
      token={token}
    >
      {children}
    </MeetingProvider>
  );
}
