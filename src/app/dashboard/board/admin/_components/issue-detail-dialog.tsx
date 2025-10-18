"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { GitPullRequest, ExternalLink, Clock } from "lucide-react";
import type { Issue, Participant } from "./admin-board-interface";

interface IssueDetailDialogProps {
  issue: Issue;
  participants: Participant[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IssueDetailDialog({
  issue,
  participants,
  open,
  onOpenChange,
}: IssueDetailDialogProps) {
  const participantsWithPR = participants.filter(
    (p) => p.hasPullRequest,
  ).length;
  const participantsWithoutPR = participants.filter(
    (p) => !p.hasPullRequest,
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{issue.title}</DialogTitle>
          <DialogDescription>{issue.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Badge className="bg-primary px-4 py-1 text-base font-bold">
              {issue.points} points
            </Badge>
            <Badge variant="outline">{issue.difficulty}</Badge>
            <Badge variant="outline">{issue.status}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">
                Total Participants
              </p>
              <p className="text-2xl font-bold">{participants.length}</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">
                With Pull Requests
              </p>
              <p className="text-2xl font-bold text-green-500">
                {participantsWithPR}
              </p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">
                Without Pull Requests
              </p>
              <p className="text-2xl font-bold text-yellow-500">
                {participantsWithoutPR}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Participants</h3>
            {participants.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No participants yet
              </p>
            ) : (
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="bg-card hover:bg-accent/50 flex items-center gap-4 rounded-lg border p-4 transition-colors"
                  >
                    <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                      <span className="text-primary-foreground text-sm font-medium">
                        {participant.avatar}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {participant.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        @{participant.username}
                      </p>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>Started {participant.startedAt}</span>
                    </div>
                    {participant.hasPullRequest ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-transparent"
                        asChild
                      >
                        <a
                          href={participant.pullRequestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GitPullRequest className="h-4 w-4 text-green-500" />
                          View PR
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="secondary">No PR yet</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
