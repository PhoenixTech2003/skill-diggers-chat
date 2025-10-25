"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { BountyCard } from "./bounty-card";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { BountyChatSheet } from "./bounty-chat-sheet";

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
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const handleMessageClick = (bounty: Bounty) => {
    setSelectedBounty(bounty);
    setIsChatOpen(true);
  };

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
                <button
                  onClick={() => handleMessageClick(bounty)}
                  className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                  title="View messages"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>

              <div className="text-muted-foreground text-xs">
                Completed {new Date(bounty.completedAt).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chat Sheet */}
      {selectedBounty && (
        <BountyChatSheet
          bountyId={selectedBounty.id}
          bountyName={selectedBounty.name}
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          isAdmin={false}
        />
      )}
    </div>
  );
}
