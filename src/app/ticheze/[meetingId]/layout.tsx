"use client";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { redirect, useParams } from "next/navigation";
import { env } from "~/env";
import { authClient } from "~/lib/auth-client";
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
  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name,
        debugMode: true,
      }}
      token={
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJhNWM1OGU5Zi01ZWNkLTQ5MDktOGUwNC1lZGM5NmU3Zjc3NWQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc2MTU0Mzg2NiwiZXhwIjoxNzYyMTQ4NjY2fQ.0IlBvInQNTolKBfZdRN0dNVIm4-hBeYtnF4vIpfyMLg"
      }
    >
      {children}
    </MeetingProvider>
  );
}
