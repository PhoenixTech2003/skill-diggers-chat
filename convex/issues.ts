import {
  mutation,
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import { Octokit } from "@octokit/rest";
import { internal } from "./_generated/api";
import { authComponent } from "./auth";
import { components } from "./_generated/api";

export const createIssue = mutation({
  args: {
    body: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userData = await authComponent.getAuthUser(ctx);
    await ctx.db.insert("githubIssue", {
      points: 0,
      status: "open",
      isApproved: false,
      openedBy: userData._id,
      body: args.body,
      title: args.title,
    });
  },
});

export const approveIssue = internalMutation({
  args: {
    issueId: v.id("githubIssue"),
    points: v.number(),
    issueNumber: v.number(),
    issueUrl: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userData = await authComponent.getAuthUser(ctx);
      await ctx.db.patch(args.issueId, {
        points: args.points,
        isApproved: true,
        approvedBy: userData._id,
        issueNumber: args.issueNumber,
        issueUrl: args.issueUrl,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const getIssueById = internalQuery({
  args: {
    issueId: v.id("githubIssue"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.issueId);
  },
});

export const approveIssueAction = action({
  args: {
    issueId: v.id("githubIssue"),
    points: v.number(),
  },
  handler: async (ctx, args): Promise<any> => {
    try {
      // First fetch the issue by ID to get title and body
      const issue = await ctx.runQuery(internal.issues.getIssueById, {
        issueId: args.issueId,
      });

      if (!issue) {
        throw new Error("Issue not found");
      }
      const accessToken = await ctx.runQuery(internal.auth.getAccessToken);
      const octokit = new Octokit({ auth: accessToken });
      const { data } = await octokit.rest.issues.create({
        owner: "PhoenixTech2003",
        repo: "skill-diggers-chat",
        title: issue.title,
        body: issue.body,
      });

      await ctx.runMutation(internal.issues.approveIssue, {
        issueId: args.issueId,
        points: args.points,
        issueNumber: data.number,
        issueUrl: data.html_url,
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const getUnapprovedIssues = query({
  args: {},
  handler: async (ctx) => {
    try {
      const issues = await ctx.db
        .query("githubIssue")
        .withIndex("by_status_approved", (q) =>
          q.eq("status", "open").eq("isApproved", false),
        )
        .collect();

      // Fetch user names for each issue
      const issuesWithUserNames = await Promise.all(
        issues.map(async (issue) => {
          const userResult = await ctx.runQuery(
            components.betterAuth.users.getUser,
            { userId: issue.openedBy },
          );
          return {
            ...issue,
            openedByName: userResult.userData?.name || "Unknown User",
          };
        }),
      );

      return {
        issuesData: issuesWithUserNames,
        issuesDataError: null,
      };
    } catch (error) {
      console.error(error);
      return {
        issuesData: null,
        issuesDataError:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

export const getApprovedIssues = query({
  args: {},
  handler: async (ctx) => {
    try {
      const issues = await ctx.db
        .query("githubIssue")
        .withIndex("by_status_approved", (q) =>
          q.eq("status", "open").eq("isApproved", true),
        )
        .collect();

      // Fetch user names for each issue
      const issuesWithUserNames = await Promise.all(
        issues.map(async (issue) => {
          const [openedByUserResult, approvedByUserResult] = await Promise.all([
            ctx.runQuery(components.betterAuth.users.getUser, {
              userId: issue.openedBy,
            }),
            issue.approvedBy
              ? ctx.runQuery(components.betterAuth.users.getUser, {
                  userId: issue.approvedBy,
                })
              : { userData: null, userDataError: null },
          ]);

          return {
            ...issue,
            openedByName: openedByUserResult.userData?.name || "Unknown User",
            approvedByName:
              approvedByUserResult.userData?.name || "Unknown User",
          };
        }),
      );

      return {
        issuesData: issuesWithUserNames,
        issuesDataError: null,
      };
    } catch (error) {
      console.error(error);
      return {
        issuesData: null,
        issuesDataError:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

export const getOpenAndApprovedIssues = query({
  args: {},
  handler: async (ctx) => {
    try {
      const issues = await ctx.db
        .query("githubIssue")
        .withIndex("by_status_approved", (q) =>
          q.eq("status", "open").eq("isApproved", true),
        )
        .collect();

      // Fetch user names for each issue
      const issuesWithUserNames = await Promise.all(
        issues.map(async (issue) => {
          const userResult = await ctx.runQuery(
            components.betterAuth.users.getUser,
            { userId: issue.openedBy },
          );
          return {
            ...issue,
            openedByName: userResult.userData?.name || "Unknown User",
          };
        }),
      );

      return {
        issuesData: issuesWithUserNames,
        issuesDataError: null,
      };
    } catch (error) {
      console.error(error);
      return {
        issuesData: null,
        issuesDataError:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});
