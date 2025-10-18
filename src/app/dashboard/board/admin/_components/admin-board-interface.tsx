"use client";

import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { IssuesList } from "./issues-list";
import { IssueDetailDialog } from "./issue-detail-dialog";
import { AssignPointsDialog } from "./assign-points.dialog";

export type Issue = {
  id: number;
  title: string;
  description: string;
  points: number;
  difficulty: string;
  participants: number;
  timePosted: string;
  tags: string[];
  status: "open" | "in-progress" | "completed";
};

export type Participant = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  hasPullRequest: boolean;
  pullRequestUrl?: string;
  startedAt: string;
};

const issuesData: Issue[] = [
  {
    id: 1,
    title: "Implement dark mode toggle",
    description:
      "Add a dark mode toggle to the settings page with persistent storage",
    points: 250,
    difficulty: "Medium",
    participants: 3,
    timePosted: "2 hours ago",
    tags: ["React", "CSS"],
    status: "in-progress",
  },
  {
    id: 2,
    title: "Fix memory leak in chat component",
    description:
      "WebSocket connections are not being properly cleaned up on unmount",
    points: 500,
    difficulty: "Hard",
    participants: 1,
    timePosted: "5 hours ago",
    tags: ["React", "WebSocket"],
    status: "in-progress",
  },
  {
    id: 3,
    title: "Add unit tests for authentication",
    description: "Write comprehensive unit tests for the auth service",
    points: 300,
    difficulty: "Medium",
    participants: 5,
    timePosted: "1 day ago",
    tags: ["Testing", "TypeScript"],
    status: "in-progress",
  },
  {
    id: 4,
    title: "Optimize database queries",
    description: "Improve performance of user search queries",
    points: 400,
    difficulty: "Hard",
    participants: 2,
    timePosted: "1 day ago",
    tags: ["Database", "Performance"],
    status: "open",
  },
];

const participantsData: Record<number, Participant[]> = {
  1: [
    {
      id: 1,
      name: "Sarah Chen",
      username: "sarahc",
      avatar: "SC",
      hasPullRequest: true,
      pullRequestUrl: "https://github.com/repo/pull/123",
      startedAt: "2 hours ago",
    },
    {
      id: 2,
      name: "Alex Kumar",
      username: "alexk",
      avatar: "AK",
      hasPullRequest: false,
      startedAt: "1 hour ago",
    },
    {
      id: 3,
      name: "Jordan Lee",
      username: "jordanl",
      avatar: "JL",
      hasPullRequest: true,
      pullRequestUrl: "https://github.com/repo/pull/124",
      startedAt: "30 minutes ago",
    },
  ],
  2: [
    {
      id: 4,
      name: "Taylor Swift",
      username: "tswift",
      avatar: "TS",
      hasPullRequest: false,
      startedAt: "3 hours ago",
    },
  ],
  3: [
    {
      id: 5,
      name: "Morgan Davis",
      username: "morgand",
      avatar: "MD",
      hasPullRequest: true,
      pullRequestUrl: "https://github.com/repo/pull/125",
      startedAt: "1 day ago",
    },
    {
      id: 6,
      name: "Casey Brown",
      username: "caseyb",
      avatar: "CB",
      hasPullRequest: true,
      pullRequestUrl: "https://github.com/repo/pull/126",
      startedAt: "1 day ago",
    },
    {
      id: 7,
      name: "Riley Johnson",
      username: "rileyj",
      avatar: "RJ",
      hasPullRequest: false,
      startedAt: "12 hours ago",
    },
    {
      id: 8,
      name: "Jamie Wilson",
      username: "jamiew",
      avatar: "JW",
      hasPullRequest: true,
      pullRequestUrl: "https://github.com/repo/pull/127",
      startedAt: "8 hours ago",
    },
    {
      id: 9,
      name: "Avery Martinez",
      username: "averym",
      avatar: "AM",
      hasPullRequest: false,
      startedAt: "6 hours ago",
    },
  ],
  4: [
    {
      id: 10,
      name: "Quinn Anderson",
      username: "quinna",
      avatar: "QA",
      hasPullRequest: false,
      startedAt: "1 day ago",
    },
    {
      id: 11,
      name: "Drew Martinez",
      username: "drewm",
      avatar: "DM",
      hasPullRequest: true,
      pullRequestUrl: "https://github.com/repo/pull/128",
      startedAt: "18 hours ago",
    },
  ],
};

export function AdminBoardInterface() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [assignPointsIssue, setAssignPointsIssue] = useState<Issue | null>(
    null,
  );

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleAssignPoints = (issue: Issue) => {
    setAssignPointsIssue(issue);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Issue Management</CardTitle>
          <CardDescription>
            Monitor and manage bounty issues and participant progress
          </CardDescription>
        </CardHeader>
      </Card>

      <IssuesList
        issues={issuesData}
        onIssueClick={handleIssueClick}
        onAssignPoints={handleAssignPoints}
      />

      {selectedIssue && (
        <IssueDetailDialog
          issue={selectedIssue}
          participants={participantsData[selectedIssue.id] || []}
          open={!!selectedIssue}
          onOpenChange={(open) => !open && setSelectedIssue(null)}
        />
      )}

      {assignPointsIssue && (
        <AssignPointsDialog
          issue={assignPointsIssue}
          open={!!assignPointsIssue}
          onOpenChange={(open) => !open && setAssignPointsIssue(null)}
        />
      )}
    </div>
  );
}
