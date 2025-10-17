"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { RelativeTime } from "~/components/relative-time";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

interface ChatAreaProps {
  roomId: string;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-500";
    case "moderator":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

export function ChatArea({ roomId }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const roomMessagesData = useQuery(api.messages.getRoomMessages, {
    roomId: roomId as Id<"room">,
  });
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="flex-1 space-y-4">
      {roomMessagesData?.messagesData?.map((message) => (
        <div
          key={message._id}
          className="group hover:bg-accent/5 flex gap-3 rounded-lg p-2 transition-colors"
        >
          <Avatar className="mt-1 h-10 w-10">
            <AvatarImage
              src={message.image ?? undefined}
              alt={message.username ?? ""}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {(message.username ?? "")
                .split(" ")
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">
                {message.username}
              </span>
              {message.role !== "user" && (
                <Badge
                  variant="secondary"
                  className={`text-xs ${getRoleColor(message.role!)} text-white`}
                >
                  {message.role}
                </Badge>
              )}
              <span className="text-muted-foreground text-xs">
                <RelativeTime
                  date={new Date(message._creationTime)}
                  addSuffix
                />
              </span>
            </div>

            <div className="text-foreground whitespace-pre-wrap">
              {message.content.includes("```") ? (
                <div className="space-y-2">
                  {message.content.split("```").map((part, index) =>
                    index % 2 === 0 ? (
                      <span key={index}>{part}</span>
                    ) : (
                      <pre
                        key={index}
                        className="bg-muted overflow-x-auto rounded-md p-3 text-sm"
                      >
                        <code>{part}</code>
                      </pre>
                    ),
                  )}
                </div>
              ) : (
                message.content
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
