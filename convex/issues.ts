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
// no type-only imports needed here

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
    openedById: v.string(),
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

      const userAccountInfo = await ctx.runQuery(
        components.betterAuth.users.getUserAccountByUserIdAndProviderID,
        {
          providerId: "github",
          userId: args.openedById,
        },
      );
      console.log("this is the account", userAccountInfo.accountId);
      console.log("this is the opened by id", args.openedById);
      console.log("this is the _id", userAccountInfo._id);
      const accessToken = await ctx.runAction(internal.auth.getAccessToken, {
        accountId: userAccountInfo._id,
        userId: args.openedById,
      });
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

export const getUnacceptedForUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user?._id) {
      return { issuesData: [], issuesDataError: null };
    }

    const accepted = await ctx.db
      .query("issueUsers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const acceptedIssueIds = new Set(accepted.map((a) => a.issueId));

    const approvedIssues = await ctx.db
      .query("githubIssue")
      .withIndex("by_status_approved", (q) =>
        q.eq("status", "open").eq("isApproved", true),
      )
      .collect();

    const unaccepted = approvedIssues.filter(
      (i) => !acceptedIssueIds.has(i._id),
    );

    // attach openedBy name
    const enriched = await Promise.all(
      unaccepted.map(async (issue) => {
        const userResult = await ctx.runQuery(
          components.betterAuth.users.getUser,
          {
            userId: issue.openedBy,
          },
        );
        return {
          ...issue,
          openedByName: userResult.userData?.name || "Unknown User",
        };
      }),
    );

    return { issuesData: enriched, issuesDataError: null };
  },
});

export const recordIssueAcceptance = internalMutation({
  args: {
    issueId: v.id("githubIssue"),
    userId: v.string(),
    branchName: v.string(),
  },
  handler: async (ctx, args) => {
    // prevent duplicate acceptance
    const existing = await ctx.db
      .query("issueUsers")
      .withIndex("by_issue_user", (q) =>
        q.eq("issueId", args.issueId).eq("userId", args.userId),
      )
      .first();
    if (existing) return existing._id;

    const id = await ctx.db.insert("issueUsers", {
      issueId: args.issueId,
      userId: args.userId,
      branchName: args.branchName,
      status: "accepted",
    });
    return id;
  },
});

export const acceptBountyAndCreateBranch = action({
  args: { issueId: v.id("githubIssue") },
  handler: async (ctx, args): Promise<{ branchName: string }> => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user?._id) throw new Error("Unauthorized");

    const issue = await ctx.runQuery(internal.issues.getIssueById, {
      issueId: args.issueId,
    });
    if (!issue || !issue.issueNumber || !issue.title) {
      throw new Error("Issue not fully initialized");
    }

    // Build branch name
    const toKebab = (s: string): string =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    const username = (user.name ?? "user").split(" ").join("");
    const branchBase: string =
      `${issue.issueNumber}-${toKebab(issue.title)}-${toKebab(username)}`.slice(
        0,
        100,
      );

    const userAccountInfo = await ctx.runQuery(
      components.betterAuth.users.getUserAccountByUserIdAndProviderID,
      { providerId: "github", userId: user._id },
    );
    const accessToken = await ctx.runAction(internal.auth.getAccessToken, {
      accountId: userAccountInfo._id,
      userId: user._id,
    });
    const octokit = new Octokit({ auth: accessToken });

    const owner = process.env.GITHUB_OWNER ?? "PhoenixTech2003";
    const repo = process.env.GITHUB_REPO ?? "skill-diggers-chat";

    // Get default branch sha
    const repoInfo = await octokit.repos.get({ owner, repo });
    const defaultBranch: string = repoInfo.data.default_branch;
    const baseRef = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
    });
    const sha: string = baseRef.data.object.sha as string;

    // Ensure unique branch name if exists
    let branchName: string = branchBase;
    let attempt = 0;
    while (true) {
      try {
        await octokit.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${branchName}`,
          sha,
        });
        break;
      } catch (e: any) {
        if (
          e?.status === 422 &&
          String(e?.message || "").includes("Reference already exists")
        ) {
          attempt += 1;
          branchName = `${branchBase}-${attempt}`.slice(0, 100);
          continue;
        }
        throw e;
      }
    }

    // Record acceptance via internal mutation
    await ctx.runMutation(internal.issues.recordIssueAcceptance, {
      issueId: args.issueId,
      userId: user._id,
      branchName,
    });

    return { branchName };
  },
});
