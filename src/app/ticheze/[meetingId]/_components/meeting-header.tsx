"use client";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

interface MeetingHeaderProps {
  meetingId: string;
}

export function MeetingHeader({ meetingId }: MeetingHeaderProps) {
  const router = useRouter();
  const videoRoom = useQuery(api.videoRooms.getVideoRoomByVideoSdkId, {
    videosdkRoomId: meetingId,
  });
  const title = videoRoom?.title ?? "Ticheze Meeting";

  return (
    <div className="bg-card border-border flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.push("/ticheze")}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Button>
        <div>
          <h1 className="text-foreground text-xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-sm">Meeting ID: {meetingId}</p>
        </div>
      </div>

      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
        <span>Live</span>
      </div>
    </div>
  );
}
