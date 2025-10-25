"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { Send, User, Shield } from "lucide-react";
import type { Id } from "convex/_generated/dataModel";

interface BountyChatSheetProps {
  bountyId: string;
  bountyName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
}

export function BountyChatSheet({
  bountyId,
  bountyName,
  isOpen,
  onOpenChange,
  isAdmin,
}: BountyChatSheetProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const comments = useQuery(api.bountyComments.getBountyComments, {
    issueUserId: bountyId as Id<"issueUsers">,
  });

  const sendComment = useMutation(api.bountyComments.sendBountyComment);
  const markAsRead = useMutation(api.bountyComments.markCommentsAsRead);

  // Mark messages as read when sheet opens
  useEffect(() => {
    if (isOpen && comments) {
      markAsRead({ issueUserId: bountyId as Id<"issueUsers"> });
    }
  }, [isOpen, comments, markAsRead, bountyId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendComment({
        issueUserId: bountyId as Id<"issueUsers">,
        message: message.trim(),
        isAdminMessage: isAdmin,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span>Messages</span>
            <Badge variant="outline" className="text-xs">
              {bountyName}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col">
          {/* Messages List */}
          <ScrollArea className="mb-6 h-[calc(100vh-20rem)]">
            <div className="space-y-3 px-4 pb-4">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className={`flex gap-2 ${
                      comment.isAdminMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        comment.isAdminMessage
                          ? "border border-blue-500/20 bg-blue-500/10"
                          : "bg-muted"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        {comment.isAdminMessage ? (
                          <Shield className="h-3 w-3 text-blue-600" />
                        ) : (
                          <User className="text-muted-foreground h-3 w-3" />
                        )}
                        <span className="text-xs font-medium">
                          {comment.isAdminMessage ? "Admin" : "You"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">
                    Start a conversation about this bounty
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Fixed Message Input at Bottom */}
          <div className="bg-background border-t p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isSending}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
