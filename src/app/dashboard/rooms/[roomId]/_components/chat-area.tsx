"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ChatAreaProps {
  roomId: string;
}

// Mock messages data
const mockMessages = [
  {
    id: 1,
    user: { name: "Alice Johnson", avatar: "AJ", role: "admin" },
    content:
      "Welcome to the JavaScript room! Feel free to ask any questions about JS, Node.js, or web development.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: "message",
  },
  {
    id: 2,
    user: { name: "Bob Smith", avatar: "BS", role: "member" },
    content:
      "Thanks! I'm having trouble with async/await. Can someone help me understand the difference between Promise.all() and Promise.allSettled()?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    type: "message",
  },
  {
    id: 3,
    user: { name: "Carol Davis", avatar: "CD", role: "moderator" },
    content:
      "Great question! Promise.all() fails fast - if any promise rejects, the whole thing rejects. Promise.allSettled() waits for all promises to complete, regardless of whether they resolve or reject.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    type: "message",
  },
  {
    id: 4,
    user: { name: "David Wilson", avatar: "DW", role: "member" },
    content:
      "Here's a quick example:\n\n```javascript\n// Promise.all - fails if any reject\nconst results = await Promise.all([fetch('/api/1'), fetch('/api/2')]);\n\n// Promise.allSettled - always completes\nconst results = await Promise.allSettled([fetch('/api/1'), fetch('/api/2')]);\n```",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    type: "message",
  },
  {
    id: 5,
    user: { name: "Eva Martinez", avatar: "EM", role: "member" },
    content:
      "That's super helpful! I've been using Promise.all() everywhere but didn't know about allSettled(). Thanks for the code example!",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    type: "message",
  },
  {
    id: 6,
    user: { name: "Frank Brown", avatar: "FB", role: "member" },
    content:
      "Does anyone have experience with the new JavaScript decorators? I'm trying to understand when to use them.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    type: "message",
  },
];

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="flex-1 space-y-4">
      {mockMessages.map((message) => (
        <div
          key={message.id}
          className="group hover:bg-accent/5 flex gap-3 rounded-lg p-2 transition-colors"
        >
          <Avatar className="mt-1 h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {message.user.avatar}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">
                {message.user.name}
              </span>
              {message.user.role !== "member" && (
                <Badge
                  variant="secondary"
                  className={`text-xs ${getRoleColor(message.user.role)} text-white`}
                >
                  {message.user.role}
                </Badge>
              )}
              <span className="text-muted-foreground text-xs">
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
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
