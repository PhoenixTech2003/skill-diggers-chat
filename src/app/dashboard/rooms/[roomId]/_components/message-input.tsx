"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageInputProps {
  roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaSize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 192; // matches Tailwind max-h-48
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  useEffect(() => {
    adjustTextareaSize();
  }, [message]);

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
    <div className="border-border bg-card/95 supports-[backdrop-filter]:bg-card/80 fixed inset-x-0 bottom-4 z-20 mx-auto w-[min(100%-1rem,420px)] rounded-xl border p-4 shadow-lg backdrop-blur sm:w-[480px] md:w-[560px] lg:w-[640px] xl:w-[720px]">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${roomId === "1" ? "JavaScript" : roomId === "2" ? "Python" : "Room"}`}
              className="bg-input border-border max-h-48 min-h-[44px] w-full resize-none overflow-x-hidden pr-12 wrap-break-word"
              wrap="soft"
              rows={1}
            />
            <div className="absolute top-2 right-2 flex gap-1"></div>
          </div>
          <Button type="submit" disabled={!message.trim()} className="h-11">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
