"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Send, Paperclip, Smile, Code } from "lucide-react";

interface MessageInputProps {
  roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would send the message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-border bg-card/95 supports-[backdrop-filter]:bg-card/80 fixed inset-x-0 bottom-4 z-20 mx-auto w-full max-w-2xl rounded-xl border p-4 shadow-lg backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${roomId === "1" ? "JavaScript" : roomId === "2" ? "Python" : "Room"}`}
              className="bg-input border-border max-h-32 min-h-[44px] resize-none pr-12"
              rows={1}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={!message.trim()} className="h-11">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {isTyping && (
          <div className="text-muted-foreground text-xs">
            Several people are typing...
          </div>
        )}
      </form>
    </div>
  );
}
