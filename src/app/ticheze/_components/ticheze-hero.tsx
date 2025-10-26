"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";

export function TichezeHero() {
  const [meetingId, setMeetingId] = useState("");
  const router = useRouter();

  const handleJoinMeeting = () => {
    if (meetingId.trim()) {
      router.push(`/ticheze/${meetingId}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoinMeeting();
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
          <Card className="bg-card/95 border-primary/30 mx-auto max-w-md space-y-4 p-8 backdrop-blur">
            <h3 className="text-foreground text-lg font-semibold">
              Join a Meeting
            </h3>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Enter meeting ID"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={handleJoinMeeting}
                disabled={!meetingId.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold whitespace-nowrap"
              >
                Join
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Enter a meeting ID to join an existing session
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
