"use client";

import { useAction } from "convex/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "../../../../../../convex/_generated/api";

const assignPointsSchema = z.object({
  points: z.coerce.number().min(1, "Points must be at least 1"),
});

type AssignPointsForm = z.infer<typeof assignPointsSchema>;

// Use a more flexible type that adapts to API changes

interface AssignPointsDialogProps {
  issue: NonNullable<
    (typeof api.issues.getUnapprovedIssues._returnType)["issuesData"]
  >[number];
  trigger: React.ReactNode;
}

export function AssignPointsDialog({
  issue,
  trigger,
}: AssignPointsDialogProps) {
  const approveIssue = useAction(api.issues.approveIssueAction);

  const form = useForm({
    resolver: zodResolver(assignPointsSchema),
    defaultValues: {
      points: issue.points || 1,
    },
  });

  const onSubmit = async (data: AssignPointsForm) => {
    await toast.promise(
      approveIssue({
        issueId: issue._id,
        points: data.points,
        openedById: issue.openedBy,
      }),
      {
        loading: "Approving issue...",
        success: (data) => {
          form.reset();
          return `Issue approved and created on GitHub! `;
        },
        error: "Failed to approve issue. Please try again.",
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Approve Issue</DialogTitle>
          <DialogDescription>
            Assign points and approve this issue to make it available on The
            Board
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Issue Title</FormLabel>
              <Input value={issue.title} disabled />
            </div>

            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Enter points value"
                      {...field}
                      value={String(field.value || "")}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-muted-foreground text-xs">
                    Recommended: Easy (10-25), Medium (25-50), Hard (50+)
                  </p>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Approve Issue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
