"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "convex/_generated/dataModel";
import { useRouter } from "next/navigation";
interface AcceptBountyDialogProps {
  bounty: {
    id: string;
    name: string;
    points: number;
    userName: string;
    branchName: string;
    userId: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AcceptBountyDialog({
  bounty,
  isOpen,
  onOpenChange,
}: AcceptBountyDialogProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const acceptBounty = useAction(api.bountyAcceptance.acceptBountyAction);
  const router = useRouter();
  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptBounty({
        issueUserId: bounty.id as Id<"issueUsers">,
        submitterId: bounty.userId,
      });

      toast.success("Bounty accepted! PR merged and points awarded.");
      onOpenChange(false);

      // Reload the page to refresh the bounties list
      router.refresh();
    } catch (error) {
      console.error("Failed to accept bounty:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to accept bounty";
      toast.error(errorMessage);
      setIsAccepting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Accept Bounty Submission
          </DialogTitle>
          <DialogDescription>
            You are about to accept and merge the bounty submission for "
            {bounty.name}". This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bounty Details */}
          <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-4">
            <h4 className="mb-2 font-semibold">Bounty Details:</h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Title:</strong> {bounty.name}
              </p>
              <p>
                <strong>Points:</strong> {bounty.points}
              </p>
              <p>
                <strong>Submitted by:</strong> {bounty.userName}
              </p>
              <p>
                <strong>Branch:</strong> {bounty.branchName}
              </p>
            </div>
          </div>

          {/* Actions that will be performed */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">
              The following actions will be performed:
            </h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>
                  Create a pull request from {bounty.branchName} to main branch
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>Automatically merge the pull request</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>
                  Award {bounty.points} points to {bounty.userName}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>Mark this bounty as completed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>Abandon all other users' attempts on this issue</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>Close the GitHub issue</span>
              </li>
            </ul>
          </div>

          {/* Warning */}
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <strong>Warning:</strong> This action is irreversible. Make sure
            you've reviewed the code and it meets all requirements before
            accepting.
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAccepting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isAccepting}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isAccepting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              "Accept & Merge"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
