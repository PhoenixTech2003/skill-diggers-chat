"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { GitBranch, Users, Clock } from "lucide-react";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

const getDifficultyColor = (points: number) => {
  if (points <= 10) {
    return "bg-green-500/10 text-green-500 border-green-500/20";
  } else if (points <= 25) {
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  } else {
    return "bg-red-500/10 text-red-500 border-red-500/20";
  }
};

export function IssuesTab({
  preloadedIssues,
}: {
  preloadedIssues: Preloaded<typeof api.issues.getOpenAndApprovedIssues>;
}) {
  const { issuesData, issuesDataError } = usePreloadedQuery(preloadedIssues);

  if (issuesDataError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Bounties</CardTitle>
          <CardDescription>
            Error loading issues: {issuesDataError}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!issuesData) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Available Bounties</CardTitle>
            <CardDescription>Loading issues...</CardDescription>
          </CardHeader>
          <div className="space-y-4 p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

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
        {issuesData.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <CardTitle className="text-muted-foreground mb-2">
                No Issues Available
              </CardTitle>
              <CardDescription>
                No approved issues available at the moment.
              </CardDescription>
            </div>
          </div>
        ) : (
          issuesData.map((issue) => (
            <Card
              key={issue._id}
              className="hover:bg-accent/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg">{issue.title}</CardTitle>
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(issue.points)}
                      >
                        {issue.points} points
                      </Badge>
                    </div>
                    <CardDescription>{issue.body}</CardDescription>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Issue #{issue.issueNumber}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {issue.openedBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        GitHub
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-primary text-2xl font-bold">
                        {issue.points}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        points
                      </div>
                    </div>
                    <Button size="sm">Accept Bounty</Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
