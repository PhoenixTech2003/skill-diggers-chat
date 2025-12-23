import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const createVideoRoom = mutation({
  args: {
    videosdkRoomId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (user.role !== "admin") {
      throw new Error("You are not authorized to create a video meeting");
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("videoRoom")
      .withIndex("by_videosdk_room_id", (q) => q.eq("videosdkRoomId", args.videosdkRoomId))
      .first();

    if (existing) {
      return existing;
    }

    const id = await ctx.db.insert("videoRoom", {
      videosdkRoomId: args.videosdkRoomId,
      title: args.title,
      createdBy: user._id,
      createdAt: now,
    });

    return await ctx.db.get(id);
  },
});

export const getVideoRoomByVideoSdkId = query({
  args: { videosdkRoomId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("videoRoom")
      .withIndex("by_videosdk_room_id", (q) => q.eq("videosdkRoomId", args.videosdkRoomId))
      .first();
  },
});

export const upsertVideoParticipantActive = mutation({
  args: { videosdkRoomId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const now = Date.now();

    const existing = await ctx.db
      .query("videoParticipant")
      .withIndex("by_room_user", (q) =>
        q.eq("videosdkRoomId", args.videosdkRoomId).eq("userId", user._id),
      )
      .first();

    if (!existing) {
      const id = await ctx.db.insert("videoParticipant", {
        videosdkRoomId: args.videosdkRoomId,
        userId: user._id,
        status: "ACTIVE",
        joinedAt: now,
        lastActiveAt: now,
        leftAt: undefined,
      });
      return await ctx.db.get(id);
    }

    await ctx.db.patch(existing._id, {
      status: "ACTIVE",
      lastActiveAt: now,
      leftAt: undefined,
    });
    return await ctx.db.get(existing._id);
  },
});

export const setVideoParticipantLeft = mutation({
  args: { videosdkRoomId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const now = Date.now();

    const existing = await ctx.db
      .query("videoParticipant")
      .withIndex("by_room_user", (q) =>
        q.eq("videosdkRoomId", args.videosdkRoomId).eq("userId", user._id),
      )
      .first();

    if (!existing) {
      // If we don't have a row yet (e.g. user left before upsert), create it as LEFT.
      const id = await ctx.db.insert("videoParticipant", {
        videosdkRoomId: args.videosdkRoomId,
        userId: user._id,
        status: "LEFT",
        joinedAt: now,
        lastActiveAt: now,
        leftAt: now,
      });
      return await ctx.db.get(id);
    }

    await ctx.db.patch(existing._id, {
      status: "LEFT",
      lastActiveAt: now,
      leftAt: now,
    });
    return await ctx.db.get(existing._id);
  },
});







