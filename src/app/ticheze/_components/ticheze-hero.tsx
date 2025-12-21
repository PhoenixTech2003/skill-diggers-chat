"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { createMeeting } from "~/server/actions";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";

const joinMeetingSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
});

type JoinMeetingFormValues = z.infer<typeof joinMeetingSchema>;

interface TichezeHeroProps {
  isAdmin: boolean;
}

export function TichezeHero({ isAdmin }: TichezeHeroProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");

  const createVideoRoom = useMutation(api.videoRooms.createVideoRoom);
  const upsertVideoParticipantActive = useMutation(
    api.videoRooms.upsertVideoParticipantActive,
  );

  const router = useRouter();
  const form = useForm<JoinMeetingFormValues>({
    resolver: zodResolver(joinMeetingSchema),
    defaultValues: {
      meetingId: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: JoinMeetingFormValues) => {
    const meetingId = values.meetingId.trim();
    await toast.promise(
      upsertVideoParticipantActive({ videosdkRoomId: meetingId }),
      {
        loading: "Preparing meeting...",
        success: "Joining meeting…",
        error: "Failed to join meeting",
      },
    );
    router.push(`/ticheze/${meetingId}`);
  };

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    try {
      await toast.promise(
        (async () => {
          const roomId = await createMeeting();
          await createVideoRoom({
            videosdkRoomId: roomId,
            title: meetingTitle.trim() || "Ticheze meeting",
          });

          const link = `${window.location.origin}/ticheze/${roomId}`;
          setShareLink(link);
          setShareOpen(true);
          return roomId;
        })(),
        {
          loading: "Creating meeting...",
          success: () => "Meeting created",
          error: "Failed to create meeting",
        },
      );
    } catch (error) {
      console.error("Error creating meeting:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const codeSnippets = [
    "const connect = () => { return true; }",
    "function debrief() { /* share insights */ }",
    "const vibe = async () => { await chill(); }",
    "class Community { build() {} }",
    "const hackathon = { debrief: true, vibe: true }",
    "function collaborate() { return together; }",
  ];

  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="from-background via-background to-primary/5 absolute inset-0 bg-gradient-to-br" />
        <div className="absolute inset-0 opacity-10">
          {codeSnippets.map((snippet, i) => (
            <div
              key={i}
              className="text-primary/40 absolute animate-pulse font-mono text-xs whitespace-nowrap"
              style={{
                top: `${(i * 16) % 100}%`,
                left: `${(i * 23) % 100}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {snippet}
            </div>
          ))}
        </div>
        {/* Floating code blocks */}
        <div className="text-primary/20 border-primary/20 bg-primary/5 absolute top-10 left-10 rounded border p-3 font-mono text-xs backdrop-blur-sm">
          <div>{"<Meeting />"}</div>
        </div>
        <div className="text-primary/20 border-primary/20 bg-primary/5 absolute right-10 bottom-20 rounded border p-3 font-mono text-xs backdrop-blur-sm">
          <div>{"{ vibe: 'chill' }"}</div>
        </div>
        <div className="text-primary/20 border-primary/20 bg-primary/5 absolute top-1/3 right-20 rounded border p-3 font-mono text-xs backdrop-blur-sm">
          <div>{"async connect()"}</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 lg:px-12">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="text-foreground text-6xl leading-tight font-bold lg:text-7xl">
              Ticheze
            </h1>
            <p className="text-primary text-2xl font-semibold">
              Skill Diggers Meeting Module
            </p>
            <p className="text-muted-foreground mx-auto max-w-xl text-xl leading-relaxed">
              Connect. Debrief. Vibe. Your dedicated space for hackathon
              debriefs, casual conversations, and building community with fellow
              programmers.
            </p>
          </div>

          {/* Meeting ID Input */}
          <Card className="bg-card/95 border-primary/30 mx-auto max-w-md p-8 backdrop-blur">
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Join a Meeting
            </h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <FormField
                  control={form.control}
                  name="meetingId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Enter meeting ID"
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full font-semibold whitespace-nowrap sm:w-auto"
                >
                  {form.formState.isSubmitting ? "Joining..." : "Join Meeting"}
                </Button>
              </form>
            </Form>

            {isAdmin && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="border-border flex-1 border-t" />
                  <span className="text-muted-foreground text-xs uppercase">
                    or
                  </span>
                  <div className="border-border flex-1 border-t" />
                </div>
                <div className="space-y-2">
                  <Input
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="Meeting title (optional)"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <Button
                    onClick={handleCreateMeeting}
                    disabled={isCreating}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full font-semibold"
                  >
                    {isCreating ? "Creating..." : "Create New Meeting"}
                  </Button>
                  <p className="text-muted-foreground text-center text-xs">
                    Create a new meeting room as an admin
                  </p>
                </div>
              </div>
            )}
            {!isAdmin && (
              <p className="text-muted-foreground mt-4 text-sm">
                Enter a meeting ID to join an existing session
              </p>
            )}
          </Card>

          <Dialog open={shareOpen} onOpenChange={setShareOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Meeting ready</DialogTitle>
                <DialogDescription>
                  Share this link to invite participants.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly />
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(shareLink);
                      toast.success("Link copied");
                    } catch {
                      toast.error("Failed to copy link");
                    }
                  }}
                  disabled={!shareLink}
                >
                  Copy
                </Button>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShareOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
