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

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userData = await ctx.db
        .query("user")
        .withIndex("email_name", (q) => q.eq("email", args.email))
        .first();
      return { userData: userData, userDataError: null };
    } catch (error) {
      console.error(error);
      return { userData: null, userDataError: "Failed to get user data" };
    }
  },
});

export const getUserAccountByUserIdAndProviderID = query({
  args: {
    userId: v.string(),
    providerId: v.union(v.literal("github")),
  },
  handler: async (ctx, args) => {
    try {
      const userAccountData = await ctx.db
        .query("account")
        .withIndex("providerId_userId", (q) =>
          q.eq("providerId", args.providerId).eq("userId", args.userId),
        )
        .first();
      return userAccountData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});
