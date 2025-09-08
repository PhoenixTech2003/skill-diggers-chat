"use client";

import { ChatArea } from "./chat-area";
import { RoomHeader } from "./room-header";
import { MessageInput } from "./message-input";
import { ScrollArea } from "~/components/ui/scroll-area";

interface RoomInterfaceProps {
  roomId: string;
}

// Mock data for the room
const getRoomData = (id: string) => {
  const rooms = {
    "1": {
      name: "JavaScript",
      description: "General JavaScript discussion",
      members: 1234,
    },
    "2": {
      name: "Python",
      description: "Python programming and frameworks",
      members: 987,
    },
    "3": {
      name: "React",
      description: "React.js development and best practices",
      members: 2156,
    },
    "4": {
      name: "TypeScript",
      description: "TypeScript tips and tricks",
      members: 876,
    },
    "5": { name: "Go", description: "Go programming language", members: 543 },
    "6": {
      name: "C++",
      description: "C++ programming and algorithms",
      members: 432,
    },
  };
  return (
    rooms[id as keyof typeof rooms] || {
      name: "Unknown Room",
      description: "Room not found",
      members: 0,
    }
  );
};

export function RoomInterface({ roomId }: RoomInterfaceProps) {
  const roomData = getRoomData(roomId);

  return (
    <div className="flex h-full flex-col">
      {/* Room Header */}
      <RoomHeader room={roomData} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat Area in Scrollable container */}
        <ScrollArea className="flex-1">
          <div className="p-4 pb-40">
            <ChatArea roomId={roomId} />
          </div>
        </ScrollArea>
        {/* Message Input */}
        <MessageInput roomId={roomId} />
      </div>
    </div>
  );
}
