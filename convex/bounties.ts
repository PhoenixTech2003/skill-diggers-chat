import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const getUserBounties = query({
  handler: async (ctx) => {
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (!user?._id) {
        return {
          bountiesData: null,
          bountiesDataError: "User not authenticated",
        };
      }

      // Get all bounties for the user from issueUsers table
      const userBounties = await ctx.db
        .query("issueUsers")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      // Fetch issue details for each bounty
      const bountiesWithDetails = await Promise.all(
        userBounties.map(async (bounty) => {
          const issue = await ctx.db.get(bounty.issueId);
          if (!issue) return null;

          return {
            id: bounty._id,
            name: issue.title,
            column: bounty.status,
            points: issue.points,
            issueNumber: issue.issueNumber,
            issueUrl: issue.issueUrl,
            branchName: bounty.branchName,
            pullRequestIsOpened: bounty.pullRequestIsOpened,
            body: issue.body,
            openedBy: issue.openedBy,
            approvedBy: issue.approvedBy,
          };
        }),
      );

      // Filter out null values (issues that don't exist)
      const validBounties = bountiesWithDetails.filter(Boolean);

      return {
        bountiesData: validBounties,
        bountiesDataError: null,
      };
    } catch (error) {
      console.error(error);
      return {
        bountiesData: null,
        bountiesDataError: "Failed to get user bounties",
      };
    }
  },
});

export const updateBountyStatus = mutation({
  args: {
    issueUserId: v.id("issueUsers"),
    newStatus: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      // Get the bounty to verify ownership
      const bounty = await ctx.db.get(args.issueUserId);
      if (!bounty) {
        throw new Error("Bounty not found");
      }

      if (bounty.userId !== user._id) {
        throw new Error("You don't own this bounty");
      }

      // Validate the new status
      const validStatuses = [
        "accepted",
        "in_progress",
        "under_review",
        "completed",
        "abandoned",
      ];
      if (!validStatuses.includes(args.newStatus)) {
        throw new Error("Invalid status");
      }

      // Update the bounty status
      await ctx.db.patch(args.issueUserId, {
        status: args.newStatus as
          | "accepted"
          | "in_progress"
          | "under_review"
          | "completed"
          | "abandoned",
      });

      return {
        success: true,
        message: "Bounty status updated successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

