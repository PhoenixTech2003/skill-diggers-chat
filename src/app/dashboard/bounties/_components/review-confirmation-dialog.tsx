"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

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
  [key: string]: unknown;
}

interface ReviewConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bounty: Bounty | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ReviewConfirmationDialog({
  isOpen,
  onOpenChange,
  bounty,
  onConfirm,
  onCancel,
  isLoading = false,
}: ReviewConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            ⚠️ Submit Bounty for Review
          </DialogTitle>
          <DialogDescription>
            You are about to submit "{bounty?.name}" for admin review. This
            action will notify the admin team to review your work.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-3 text-sm">
            <strong className="text-foreground">Please ensure:</strong>
            <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
              <li>• Your work is complete and functional</li>
              <li>• You've followed all requirements</li>
              <li>• You've tested your implementation</li>
              <li>• You're ready for admin feedback</li>
            </ul>
          </div>
          <p className="text-muted-foreground text-sm">
            Once submitted, the admin will review your work and provide
            feedback. You can make changes if requested.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? "Submitting..." : "Submit for Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
