import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal, components } from "./_generated/api";
import { v } from "convex/values";
import { Octokit } from "@octokit/rest";
import { authComponent } from "./auth";

export const acceptBountyAction = action({
  args: {
    issueUserId: v.id("issueUsers"),
    submitterId: v.string(),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ success: boolean; prNumber: number; prUrl: string }> => {
    try {
      // 1. Get admin user
      const admin = await authComponent.getAuthUser(ctx);
      if (!admin?._id) {
        throw new Error("Unauthorized");
      }
      if (admin.role !== "admin") {
        throw new Error("Only admins can accept bounties");
      }

      // 2. Get bounty and issue details
      const bounty = await ctx.runQuery(
        internal.bountyAcceptance.getBountyDetails,
        {
          issueUserId: args.issueUserId,
        },
      );

      if (!bounty || !bounty.issueNumber) {
        throw new Error("Bounty not found or missing issue number");
      }

      // 3. Get submitter's GitHub account and access token
      const submitterAccount = await ctx.runQuery(
        components.betterAuth.users.getUserAccountByUserIdAndProviderID,
        {
          providerId: "github",
          userId: args.submitterId,
        },
      );

      if (!submitterAccount) {
        throw new Error("Submitter GitHub account not found");
      }

      const submitterToken = await ctx.runAction(internal.auth.getAccessToken, {
        accountId: submitterAccount._id,
        userId: args.submitterId,
      });

      // 4. Get admin's GitHub account and access token
      const adminAccount = await ctx.runQuery(
        components.betterAuth.users.getUserAccountByUserIdAndProviderID,
        {
          providerId: "github",
          userId: admin._id,
        },
      );

      if (!adminAccount) {
        throw new Error("Admin GitHub account not found");
      }

      const adminToken = await ctx.runAction(internal.auth.getAccessToken, {
        accountId: adminAccount._id,
        userId: admin._id,
      });

      const owner = process.env.GITHUB_OWNER ?? "PhoenixTech2003";
      const repo = process.env.GITHUB_REPO ?? "skill-diggers-chat";

      // 5. Create PR using submitter's token
      const submitterOctokit = new Octokit({ auth: submitterToken });

      const prTitle = `Completed #${bounty.issueNumber}: ${bounty.issueTitle}`;
      const prBody = `
Completed #${bounty.issueNumber}

**Points:** ${bounty.points}
**Submitted by:** @${args.submitterId}

This PR resolves the bounty for issue #${bounty.issueNumber}.
`;

      console.log(`Creating PR from ${bounty.branchName} to main`);

      let pr;
      try {
        const createPrResponse = await submitterOctokit.rest.pulls.create({
          owner,
          repo,
          title: prTitle,
          body: prBody,
          head: bounty.branchName,
          base: "main",
        });
        pr = createPrResponse.data;
      } catch (error) {
        if (error instanceof Error && error.message.includes("No commits")) {
          throw new Error("Branch has no commits or does not exist");
        }
        if (
          error instanceof Error &&
          error.message.includes("already exists")
        ) {
          throw new Error("A pull request already exists for this branch");
        }
        throw new Error(
          `Failed to create pull request: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      console.log(`PR created: #${pr.number}`);

      // 6. Wait a moment for GitHub to process the PR, then check if mergeable
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const adminOctokit = new Octokit({ auth: adminToken });
      const prCheck = await adminOctokit.rest.pulls.get({
        owner,
        repo,
        pull_number: pr.number,
      });

      // Check for merge conflicts
      if (prCheck.data.mergeable === false) {
        // Close the PR since we can't merge it
        await adminOctokit.rest.pulls.update({
          owner,
          repo,
          pull_number: pr.number,
          state: "closed",
        });
        throw new Error(
          "Cannot merge - conflicts detected. User needs to resolve conflicts.",
        );
      }

      // 7. Merge PR using admin's token
      console.log(`Merging PR #${pr.number}`);
      try {
        await adminOctokit.rest.pulls.merge({
          owner,
          repo,
          pull_number: pr.number,
          merge_method: "merge",
          commit_title: prTitle,
        });
      } catch (error) {
        throw new Error(
          `Failed to merge pull request: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      console.log(`PR merged successfully`);

      // 8. Award points to user
      await ctx.runMutation(internal.bountyAcceptance.awardPointsToUser, {
        userId: args.submitterId,
        points: bounty.points,
      });

      // 9. Update bounty status to completed for submitter
      await ctx.runMutation(internal.bountyAcceptance.completeBounty, {
        issueUserId: args.issueUserId,
      });

      // 10. Abandon other users' bounties for this issue
      await ctx.runMutation(internal.bountyAcceptance.abandonOtherBounties, {
        issueId: bounty.issueId,
        acceptedUserId: args.submitterId,
      });

      // 11. Close the GitHub issue
      console.log(`Closing issue #${bounty.issueNumber}`);
      await adminOctokit.rest.issues.update({
        owner,
        repo,
        issue_number: bounty.issueNumber,
        state: "closed",
      });

      // 12. Update the issue status in database
      await ctx.runMutation(internal.bountyAcceptance.closeIssue, {
        issueId: bounty.issueId,
      });

      console.log(`Bounty acceptance completed successfully`);

      return {
        success: true,
        prNumber: pr.number,
        prUrl: pr.html_url,
      };
    } catch (error) {
      console.error("Bounty acceptance failed:", error);
      throw error;
    }
  },
});

export const getBountyDetails = internalQuery({
  args: {
    issueUserId: v.id("issueUsers"),
  },
  handler: async (ctx, args) => {
    const bounty = await ctx.db.get(args.issueUserId);
    if (!bounty) {
      return null;
    }

    const issue = await ctx.db.get(bounty.issueId);
    if (!issue) {
      return null;
    }

    return {
      issueId: bounty.issueId,
      branchName: bounty.branchName,
      issueNumber: issue.issueNumber,
      issueTitle: issue.title,
      points: issue.points,
    };
  },
});

export const awardPointsToUser = internalMutation({
  args: {
    userId: v.string(),
    points: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if user already has a leaderboard entry
    const existingEntry = await ctx.db
      .query("leaderboard")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingEntry) {
      // Update existing entry
      await ctx.db.patch(existingEntry._id, {
        points: existingEntry.points + args.points,
      });
    } else {
      // Create new entry
      await ctx.db.insert("leaderboard", {
        userId: args.userId,
        points: args.points,
      });
    }
  },
});

export const completeBounty = internalMutation({
  args: {
    issueUserId: v.id("issueUsers"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.issueUserId, {
      status: "completed",
    });
  },
});

export const abandonOtherBounties = internalMutation({
  args: {
    issueId: v.id("githubIssue"),
    acceptedUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find all bounties for this issue using the index
    const allIssueBounties = await ctx.db
      .query("issueUsers")
      .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
      .collect();

    // Filter to exclude the accepted user
    const otherBounties = allIssueBounties.filter(
      (bounty) => bounty.userId !== args.acceptedUserId,
    );

    // Update all of them to abandoned status
    for (const bounty of otherBounties) {
      await ctx.db.patch(bounty._id, {
        status: "abandoned",
      });
    }
  },
});

export const closeIssue = internalMutation({
  args: {
    issueId: v.id("githubIssue"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.issueId, {
      status: "closed",
    });
  },
});
