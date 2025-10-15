import { query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
export const getUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userData = await ctx.db.get(args.userId as Id<"user">);
      return { userData: userData, userDataError: null };
    } catch (error) {
      console.error(error);
      return { userData: null, userDataError: "Failed to get user data" };
    }
  },
});
