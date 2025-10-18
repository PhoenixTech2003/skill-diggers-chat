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
import { Clock, User } from "lucide-react";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { AssignPointsDialog } from "./assign-points.dialog";

interface UnapprovedIssuesTabProps {
  preloadedIssues: Preloaded<typeof api.issues.getUnapprovedIssues>;
}

export function UnapprovedIssuesTab({
  preloadedIssues,
}: UnapprovedIssuesTabProps) {
  const { issuesData, issuesDataError } = usePreloadedQuery(preloadedIssues);

  if (issuesDataError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unapproved Issues</CardTitle>
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
            <CardTitle>Unapproved Issues</CardTitle>
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
          <CardTitle>Unapproved Issues</CardTitle>
          <CardDescription>
            Review and approve issues to make them available on The Board
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {issuesData.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <CardTitle className="text-muted-foreground mb-2">
                No Unapproved Issues
              </CardTitle>
              <CardDescription>
                All issues have been approved or no issues have been created
                yet.
              </CardDescription>
            </div>
          </div>
        ) : (
          issuesData.map((issue) => (
            <AssignPointsDialog
              key={issue._id}
              issue={issue}
              trigger={
                <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-lg">
                            {issue.title}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
                          >
                            Pending Approval
                          </Badge>
                          {issue.issueNumber && (
                            <Badge
                              variant="outline"
                              className="border-blue-500/20 bg-blue-500/10 text-lg font-bold text-blue-500"
                            >
                              #{issue.issueNumber}
                            </Badge>
                          )}
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
                            Created{" "}
                            {new Date(issue._creationTime).toLocaleDateString()}
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
                        <Button size="sm" variant="outline">
                          Assign Points
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
