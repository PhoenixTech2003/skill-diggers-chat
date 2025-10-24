"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type {
  DropResult,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { BountyCard } from "./bounty-card";
import { ReviewConfirmationDialog } from "./review-confirmation-dialog";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { Id } from "convex/_generated/dataModel";

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

const columns = [
  {
    id: "accepted",
    name: "Accepted",
    color: "#3B82F6",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: "in_progress",
    name: "In Progress",
    color: "#F59E0B",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    id: "under_review",
    name: "Under Review",
    color: "#8B5CF6",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
];

export function BountiesKanban() {
  const bountiesData = useQuery(api.bounties.getUserBounties);
  const updateBountyStatus = useMutation(api.bounties.updateBountyStatus);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingBounty, setPendingBounty] = useState<{
    bounty: Bounty;
    newColumn: string;
  } | null>(null);

  // Update local state when data changes
  useEffect(() => {
    if (bountiesData?.bountiesData) {
      const filteredBounties = bountiesData.bountiesData.filter(
        (bounty) => bounty !== null,
      ) as Bounty[];
      setBounties(filteredBounties);
    }
  }, [bountiesData?.bountiesData]);

  // Handle loading and error states AFTER all hooks
  if (bountiesData?.bountiesDataError) {
    return (
      <div className="text-muted-foreground text-center">
        Error loading bounties: {bountiesData.bountiesDataError}
      </div>
    );
  }

  if (!bountiesData?.bountiesData) {
    return (
      <div className="text-muted-foreground text-center">
        Loading bounties...
      </div>
    );
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newColumn = destination.droppableId;
    const bountyId = draggableId;

    // Find the bounty being moved
    const movedBounty = bounties.find((bounty) => bounty.id === bountyId);
    if (!movedBounty) {
      return;
    }

    // If moving to the same column, just reorder
    if (movedBounty.column === newColumn) {
      // Reorder within the same column
      const newBounties = Array.from(bounties);
      const sourceIndex = source.index;
      const destIndex = destination.index;

      const [removed] = newBounties.splice(sourceIndex, 1);
      if (removed) {
        newBounties.splice(destIndex, 0, removed);
        setBounties(newBounties);
      }
      return;
    }

    // Check if moving to "under_review" - show warning dialog
    if (newColumn === "under_review") {
      setPendingBounty({ bounty: movedBounty, newColumn });
      setShowWarningDialog(true);
      return;
    }

    // Update the bounty's column for other columns
    const updatedBounty: Bounty = { ...movedBounty, column: newColumn };
    const newBounties = bounties.map((bounty) =>
      bounty.id === bountyId ? updatedBounty : bounty,
    );

    // Optimistically update the UI
    setBounties(newBounties);

    try {
      // Update in the database
      await updateBountyStatus({
        issueUserId: bountyId as Id<"issueUsers">,
        newStatus: newColumn,
      });

      toast.success("Bounty status updated");
    } catch (error) {
      console.error("Failed to update bounty status:", error);
      toast.error("Failed to update bounty status");

      // Revert the optimistic update
      setBounties(
        (bountiesData?.bountiesData?.filter(
          (bounty) => bounty !== null,
        ) as Bounty[]) || [],
      );
    }
  };

  const getBountiesForColumn = (columnId: string) => {
    return bounties.filter((bounty) => bounty.column === columnId);
  };

  const handleConfirmSubmission = async () => {
    if (!pendingBounty) return;

    setIsSubmitting(true);
    const { bounty, newColumn } = pendingBounty;

    // Update the bounty's column
    const updatedBounty: Bounty = { ...bounty, column: newColumn };
    const newBounties = bounties.map((b) =>
      b.id === bounty.id ? updatedBounty : b,
    );

    // Optimistically update the UI
    setBounties(newBounties);

    try {
      // Update in the database
      await updateBountyStatus({
        issueUserId: bounty.id as Id<"issueUsers">,
        newStatus: newColumn,
      });

      toast.success("Bounty submitted for review!");

      // Close dialog and reset state
      setShowWarningDialog(false);
      setPendingBounty(null);
    } catch (error) {
      console.error("Failed to update bounty status:", error);
      toast.error("Failed to submit bounty for review");

      // Revert the optimistic update
      setBounties(
        (bountiesData?.bountiesData?.filter(
          (bounty) => bounty !== null,
        ) as Bounty[]) || [],
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmission = () => {
    setShowWarningDialog(false);
    setPendingBounty(null);
  };

  return (
    <div className="p-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {columns.map((column) => {
            const columnBounties = getBountiesForColumn(column.id);

            return (
              <div key={column.id} className="space-y-4">
                {/* Column Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="text-foreground font-semibold">
                      {column.name}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {columnBounties.length}
                  </Badge>
                </div>

                {/* Droppable Column */}
                <Droppable droppableId={column.id}>
                  {(
                    provided: DroppableProvided,
                    snapshot: DroppableStateSnapshot,
                  ) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] rounded-lg border-2 border-dashed p-4 transition-colors ${
                        snapshot.isDraggingOver
                          ? `${column.bgColor} ${column.borderColor} border-solid`
                          : "border-muted-foreground/20 bg-muted/10"
                      }`}
                    >
                      {columnBounties.length === 0 ? (
                        <div className="text-muted-foreground flex h-32 items-center justify-center">
                          <p className="text-sm">No bounties</p>
                        </div>
                      ) : (
                        columnBounties.map((bounty, index) => (
                          <Draggable
                            key={bounty.id}
                            draggableId={bounty.id}
                            index={index}
                          >
                            {(
                              provided: DraggableProvided,
                              snapshot: DraggableStateSnapshot,
                            ) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 w-full last:mb-0 ${
                                  snapshot.isDragging
                                    ? "scale-105 rotate-2"
                                    : ""
                                } transition-transform`}
                              >
                                <Card className="w-full cursor-grab p-4 transition-shadow hover:shadow-md active:cursor-grabbing">
                                  <BountyCard
                                    name={bounty.name}
                                    points={bounty.points}
                                    issueNumber={bounty.issueNumber}
                                    issueUrl={bounty.issueUrl}
                                    branchName={bounty.branchName}
                                  />
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Review Confirmation Dialog */}
      <ReviewConfirmationDialog
        isOpen={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        bounty={pendingBounty?.bounty || null}
        onConfirm={handleConfirmSubmission}
        onCancel={handleCancelSubmission}
        isLoading={isSubmitting}
      />
    </div>
  );
}
