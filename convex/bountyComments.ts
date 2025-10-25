import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const getBountyComments = query({
  args: {
    issueUserId: v.id("issueUsers"),
  },
  handler: async (ctx, args) => {
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      // Get all comments for this bounty
      const comments = await ctx.db
        .query("bountyComment")
        .withIndex("by_issue_user", (q) =>
          q.eq("issueUserId", args.issueUserId),
        )
        .order("asc")
        .collect();

      return comments;
    } catch (error) {
      console.error("Failed to get bounty comments:", error);
      throw error;
    }
  },
});

export const getUnreadCommentCount = query({
  args: {
    issueUserId: v.id("issueUsers"),
  },
  handler: async (ctx, args) => {
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (!user?._id) {
        return 0;
      }

      // Get all comments for this bounty
      const comments = await ctx.db
        .query("bountyComment")
        .withIndex("by_issue_user", (q) =>
          q.eq("issueUserId", args.issueUserId),
        )
        .collect();

      // Get all read records for this user
      const readRecords = await ctx.db
        .query("bountyCommentRead")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      const readCommentIds = new Set(
        readRecords.map((record) => record.commentId),
      );

      // Count unread comments (comments not in read records)
      const unreadCount = comments.filter(
        (comment) =>
          !readCommentIds.has(comment._id) && comment.userId !== user._id,
      ).length;

      return unreadCount;
    } catch (error) {
      console.error("Failed to get unread comment count:", error);
      return 0;
    }
  },
});

export const sendBountyComment = mutation({
  args: {
    issueUserId: v.id("issueUsers"),
    message: v.string(),
    isAdminMessage: v.boolean(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      // Create the comment
      const commentId = await ctx.db.insert("bountyComment", {
        issueUserId: args.issueUserId,
        userId: user._id,
        message: args.message,
        isAdminMessage: args.isAdminMessage,
        createdAt: Date.now(),
      });

      return commentId;
    } catch (error) {
      console.error("Failed to send bounty comment:", error);
      throw error;
    }
  },
});

export const markCommentsAsRead = mutation({
  args: {
    issueUserId: v.id("issueUsers"),
  },
  handler: async (ctx, args) => {
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      // Get all comments for this bounty that aren't from the current user
      const comments = await ctx.db
        .query("bountyComment")
        .withIndex("by_issue_user", (q) =>
          q.eq("issueUserId", args.issueUserId),
        )
        .filter((q) => q.neq(q.field("userId"), user._id))
        .collect();

      // Mark each comment as read
      const readAt = Date.now();
      for (const comment of comments) {
        // Check if already marked as read
        const existingRead = await ctx.db
          .query("bountyCommentRead")
          .withIndex("by_comment_user", (q) =>
            q.eq("commentId", comment._id).eq("userId", user._id),
          )
          .first();

        if (!existingRead) {
          await ctx.db.insert("bountyCommentRead", {
            commentId: comment._id,
            userId: user._id,
            readAt,
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to mark comments as read:", error);
      throw error;
    }
  },
});

export const getCompletedBounties = query({
  handler: async (ctx) => {
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (!user?._id) {
        return {
          bountiesData: null,
          bountiesDataError: "User not authenticated",
        };
      }

      // Get all completed bounties for the user
      const userBounties = await ctx.db
        .query("issueUsers")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("status"), "completed"))
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
            completedAt: bounty._creationTime, // Use creation time as completion time
          };
        }),
      );

      // Filter out null values and sort by completion date (most recent first)
      const validBounties = bountiesWithDetails
        .filter(
          (bounty): bounty is NonNullable<typeof bounty> => bounty !== null,
        )
        .sort((a, b) => b.completedAt - a.completedAt);

      return {
        bountiesData: validBounties,
        bountiesDataError: null,
      };
    } catch (error) {
      console.error(error);
      return {
        bountiesData: null,
        bountiesDataError: "Failed to get completed bounties",
      };
    }
  },
});

export const getSubmittedBounties = query({
  handler: async (ctx) => {
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      // Check if user is admin
      if (user.role !== "admin") {
        throw new Error("Access denied. Admin role required.");
      }

      // Get all bounties with status "under_review"
      const submittedBounties = await ctx.db
        .query("issueUsers")
        .filter((q) => q.eq(q.field("status"), "under_review"))
        .collect();

      // Fetch issue details and user info for each bounty
      const bountiesWithDetails = await Promise.all(
        submittedBounties.map(async (bounty) => {
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
            userId: bounty.userId,
            userName: `User ${bounty.userId.slice(-6)}`, // Use last 6 chars of userId as display name
            submittedAt: bounty._creationTime,
          };
        }),
      );

      // Filter out null values and sort by submission date (most recent first)
      const validBounties = bountiesWithDetails
        .filter(
          (bounty): bounty is NonNullable<typeof bounty> => bounty !== null,
        )
        .sort((a, b) => b.submittedAt - a.submittedAt);

      return {
        bountiesData: validBounties,
        bountiesDataError: null,
      };
    } catch (error) {
      console.error(error);
      return {
        bountiesData: null,
        bountiesDataError: "Failed to get submitted bounties",
      };
    }
  },
});
