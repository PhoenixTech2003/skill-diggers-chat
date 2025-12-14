"use client";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { redirect, useParams } from "next/navigation";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";

async function getVideoSdkToken() {
  const res = await fetch("/api/video-sdk/get-token", { cache: "no-store" });
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
  const user = authClient.useSession();
  if (!user.data?.user) {
    redirect("/auth/login");
  }
  const name = user.data?.user.name;

  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const t = await getVideoSdkToken();
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
  }, []);

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
