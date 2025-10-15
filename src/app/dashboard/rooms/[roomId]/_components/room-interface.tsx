"use client";

import { ChatArea } from "./chat-area";
import { RoomHeader } from "./room-header";
import { MessageInput } from "./message-input";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Id } from "convex/_generated/dataModel";

interface RoomInterfaceProps {
  roomId: string;
}

export function RoomInterface({ roomId }: RoomInterfaceProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Room Header */}
      <RoomHeader roomId={roomId} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat Area in Scrollable container */}
        <ScrollArea className="flex-1">
          <div className="p-4 pb-56">
            <ChatArea roomId={roomId} />
          </div>
        </ScrollArea>
        {/* Message Input */}
        <MessageInput roomId={roomId} />
      </div>
    </div>
  );
}
