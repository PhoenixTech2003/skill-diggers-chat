"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  MessageCircle,
  User,
  Calendar,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { BountyChatSheet } from "../../../bounties/_components/bounty-chat-sheet";
import { AcceptBountyDialog } from "./accept-bounty-dialog";

interface SubmittedBounty {
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
  userId: string;
  userName: string;
  submittedAt: number;
  [key: string]: unknown;
}

export function SubmittedBountiesTab() {
  const bountiesData = useQuery(api.bountyComments.getSubmittedBounties);
  const [selectedBounty, setSelectedBounty] = useState<SubmittedBounty | null>(
    null,
  );
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [bountyToAccept, setBountyToAccept] = useState<SubmittedBounty | null>(
    null,
  );

  // Handle loading and error states
  if (bountiesData?.bountiesDataError) {
    return (
      <div className="text-muted-foreground text-center">
        Error loading submitted bounties: {bountiesData.bountiesDataError}
      </div>
    );
  }

  if (!bountiesData?.bountiesData) {
    return (
      <div className="text-muted-foreground text-center">
        Loading submitted bounties...
      </div>
    );
  }

  const bounties = bountiesData.bountiesData.filter(
    (bounty) => bounty !== null,
  ) as SubmittedBounty[];

  const handleMessageClick = (bounty: SubmittedBounty) => {
    setSelectedBounty(bounty);
    setIsChatOpen(true);
  };

  const handleAcceptClick = (bounty: SubmittedBounty) => {
    setBountyToAccept(bounty);
    setAcceptDialogOpen(true);
  };

  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || "PhoenixTech2003";
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "skill-diggers-chat";

  if (bounties.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        <p className="text-lg">No submitted bounties</p>
        <p className="text-sm">
          Bounties submitted for review will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-muted-foreground text-sm">
        {bounties.length} submitted bounty{bounties.length !== 1 ? "ies" : ""}{" "}
        awaiting review
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
                {bounty.column === "under_review" && (
                  <button
                    onClick={() => handleMessageClick(bounty)}
                    className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                    title="View messages"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <User className="h-3 w-3" />
                  <span className="truncate">{bounty.userName}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Submitted{" "}
                    {new Date(bounty.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <a
                  href={`https://github.com/${owner}/${repo}/tree/${bounty.branchName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs transition-colors"
                >
                  <GitBranch className="h-3 w-3" />
                  <span className="truncate">{bounty.branchName}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              </div>

              <Button
                onClick={() => handleAcceptClick(bounty)}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                size="sm"
              >
                Accept Bounty
              </Button>
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
          isAdmin={true}
        />
      )}

      {/* Accept Bounty Dialog */}
      {bountyToAccept && (
        <AcceptBountyDialog
          bounty={bountyToAccept}
          isOpen={acceptDialogOpen}
          onOpenChange={setAcceptDialogOpen}
        />
      )}
    </div>
  );
}
