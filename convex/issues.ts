import { mutation, action, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Octokit } from "@octokit/rest";
import { internal } from "./_generated/api";
import { authComponent } from "./auth";

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

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

export const approveIssueAction = action({
  args: {
    issueId: v.id("githubIssue"),
    points: v.number(),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const { data } = await octokit.rest.issues.create({
        owner: "PhoenixTech2003",
        repo: "skill-diggers-chat",
        title: args.title,
        body: args.body,
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

export const getOpenAndApprovedIssues = query({
  args: {},
  handler: async (ctx) => {
    try {
      const data = await ctx.db
        .query("githubIssue")
        .withIndex("by_status_approved", (q) =>
          q.eq("status", "open").eq("isApproved", true),
        )
        .collect();

      return {
        issuesData: data,
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
