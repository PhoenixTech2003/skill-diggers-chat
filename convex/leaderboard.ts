import { query } from "./_generated/server";
import { v } from "convex/values";

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const leaderboard = await ctx.db
      .query("leaderboard")
      .withIndex("by_points")
      .order("desc");
    return leaderboard;
  },
});
