"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Clock, User, ExternalLink, CheckCircle } from "lucide-react";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";

interface ApprovedIssuesTabProps {
  preloadedIssues: Preloaded<typeof api.issues.getApprovedIssues>;
}

export function ApprovedIssuesTab({ preloadedIssues }: ApprovedIssuesTabProps) {
  const { issuesData, issuesDataError } = usePreloadedQuery(preloadedIssues);

  if (issuesDataError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approved Issues</CardTitle>
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
            <CardTitle>Approved Issues</CardTitle>
            <CardDescription>Loading issues...</CardDescription>
          </CardHeader>
          <CardContent>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Approved Issues</CardTitle>
          <CardDescription>
            Issues that have been approved and are available on The Board
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {issuesData.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <CardTitle className="text-muted-foreground mb-2">
                No Approved Issues
              </CardTitle>
              <CardDescription>
                No issues have been approved yet.
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
                        className="border-green-500/20 bg-green-500/10 text-green-500"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Approved
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {issue.body}
                    </CardDescription>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {issue.openedByName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Issue #{issue.issueNumber}
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
                    {issue.issueUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={issue.issueUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View on GitHub
                        </a>
                      </Button>
                    )}
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
