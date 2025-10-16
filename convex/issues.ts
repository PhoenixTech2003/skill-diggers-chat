import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createIssue = mutation({
  args: {
    issueUrl: v.string(),
    points: v.number(),
    issueNumber: v.number(),
    openedBy: v.string(),
    body: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("githubIssue", {
      issueUrl: args.issueUrl,
      points: args.points,
      status: "open",
      isApproved: false,
      issueNumber: args.issueNumber,
      openedBy: args.openedBy,
      body: args.body,
      title: args.title,
    });
  },
});
