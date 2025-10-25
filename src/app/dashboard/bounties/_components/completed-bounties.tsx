"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

interface Bounty {
  id: string;
  name: string;
  column: string;
  points: number;
  issueNumber?: number;
  issueUrl?: string;
  branchName: string;
  pullRequestIsOpened?: boolean;
  body?: string;
  openedBy?: string;
  approvedBy?: string;
  completedAt: number;
  [key: string]: unknown;
}

export function CompletedBounties() {
  const bountiesData = useQuery(api.bountyComments.getCompletedBounties);

  // Handle loading and error states
  if (bountiesData?.bountiesDataError) {
    return (
      <div className="text-muted-foreground text-center">
        Error loading completed bounties: {bountiesData.bountiesDataError}
      </div>
    );
  }

  if (!bountiesData?.bountiesData) {
    return (
      <div className="text-muted-foreground text-center">
        Loading completed bounties...
      </div>
    );
  }

  const bounties = bountiesData.bountiesData.filter(
    (bounty) => bounty !== null,
  ) as Bounty[];

  if (bounties.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        <p className="text-lg">No completed bounties yet</p>
        <p className="text-sm">Complete your first bounty to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-muted-foreground text-sm">
        {bounties.length} completed bounty{bounties.length !== 1 ? "ies" : ""}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bounties.map((bounty) => (
          <Card key={bounty.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="truncate text-sm font-medium">
                    {bounty.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {bounty.points} pts
                    </Badge>
                    {bounty.issueNumber && (
                      <span className="text-muted-foreground text-xs">
                        #{bounty.issueNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-muted-foreground text-xs">
                Completed {new Date(bounty.completedAt).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
