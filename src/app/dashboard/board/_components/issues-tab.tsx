"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { GitBranch, Users, Clock } from "lucide-react";

const issuesData = [
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
  },
  {
    id: 5,
    title: "Create onboarding tutorial",
    description: "Build an interactive tutorial for new users",
    points: 350,
    difficulty: "Medium",
    participants: 4,
    timePosted: "2 days ago",
    tags: ["UI/UX", "React"],
  },
  {
    id: 6,
    title: "Add email notifications",
    description: "Implement email notifications for important events",
    points: 200,
    difficulty: "Easy",
    participants: 7,
    timePosted: "3 days ago",
    tags: ["Backend", "Email"],
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "Medium":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "Hard":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function IssuesTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Bounties</CardTitle>
          <CardDescription>
            Accept a bounty and start earning points by solving issues
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {issuesData.map((issue) => (
          <Card key={issue.id} className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(issue.difficulty)}
                    >
                      {issue.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{issue.description}</CardDescription>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{issue.timePosted}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{issue.participants} working on this</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {issue.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Badge className="bg-primary px-4 py-1 text-lg font-bold">
                    {issue.points} pts
                  </Badge>
                  <Button size="sm" className="gap-2">
                    <GitBranch className="h-4 w-4" />
                    Accept Bounty
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
