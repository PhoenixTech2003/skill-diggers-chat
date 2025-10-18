"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Users, Clock, Eye, Coins } from "lucide-react";
import type { Issue } from "./admin-board-interface";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "in-progress":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "completed":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

interface IssuesListProps {
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
  onAssignPoints: (issue: Issue) => void;
}

export function IssuesList({
  issues,
  onIssueClick,
  onAssignPoints,
}: IssuesListProps) {
  return (
    <div className="grid gap-4">
      {issues.map((issue) => (
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
                  <Badge
                    variant="outline"
                    className={getStatusColor(issue.status)}
                  >
                    {issue.status}
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
                    <span>{issue.participants} participants</span>
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
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => onIssueClick(issue)}
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => onAssignPoints(issue)}
                  >
                    <Coins className="h-4 w-4" />
                    Assign Points
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
