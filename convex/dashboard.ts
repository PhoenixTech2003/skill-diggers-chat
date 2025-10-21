import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getUserStats = query({
  handler: async (ctx) => {
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (!user?._id) {
        return {
          userStatsData: null,
          userStatsDataError: "User not authenticated",
        };
      }

      // Get total rooms joined
      const roomMemberships = await ctx.db
        .query("roomMember")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      const roomsJoined = roomMemberships.length;

      // Get bounties completed (status = "completed")
      const completedBounties = await ctx.db
        .query("issueUsers")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("status"), "completed"))
        .collect();
      const bountiesCompleted = completedBounties.length;

      // Get user's leaderboard points
      const leaderboardEntry = await ctx.db
        .query("leaderboard")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first();
      const leaderboardPoints = leaderboardEntry?.points || 0;

      return {
        userStatsData: {
          roomsJoined,
          bountiesCompleted,
          leaderboardPoints,
        },
        userStatsDataError: null,
      };
    } catch (error) {
      console.error(error);
      return {
        userStatsData: null,
        userStatsDataError: "Failed to get user stats",
      };
    }
  },
});
