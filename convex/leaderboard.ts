import { components } from "./_generated/api";
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { authComponent } from "./auth";

export const getLeaderboard = query({
  handler: async (ctx) => {
    try {
      const leaderboard = await ctx.db
        .query("leaderboard")
        .withIndex("by_points")
        .order("desc")
        .collect();
      const formattedLeaderboard = await Promise.all(
        leaderboard.map(async (user) => {
          const userData = await ctx.runQuery(
            components.betterAuth.users.getUser,
            {
              userId: user.userId,
            },
          );
          return {
            ...user,
            name: userData.userData?.name,
            image: userData.userData?.image,
          };
        }),
      );
      return {
        leaderboardData: formattedLeaderboard,
        leaderboardDataError: null,
      };
    } catch (error) {
      console.error(error);
      return {
        leaderboardData: null,
        leaderboardDataError: "Failed to get leaderboard data",
      };
    }
  },
});

export const ensureUserInLeaderboard = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("leaderboard")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!existing) {
      await ctx.db.insert("leaderboard", {
        userId: args.userId,
        points: 0,
      });
    }
  },
});

export const enrollCurrentUser = mutation({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user?._id) throw new Error("Unauthorized");

    await ctx.runMutation(internal.leaderboard.ensureUserInLeaderboard, {
      userId: user._id,
    });
  },
});
