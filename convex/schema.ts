import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  room: defineTable({
    name: v.string(),
    createdBy: v.string(),
  }),
  roomMember: defineTable({
    roomId: v.id("room"),
    userId: v.string(),
  })
    .index("by_room_user", ["roomId", "userId"])
    .index("by_user", ["userId"])
    .index("by_room", ["roomId"]),
  message: defineTable({
    roomId: v.id("room"),
    userId: v.string(),
    content: v.string(),
    isLastMessage: v.boolean(),
  }).index("by_room", ["roomId"]),
  githubIssue: defineTable({
    issueUrl: v.string(),
    points: v.number(),
    status: v.union(v.literal("open"), v.literal("closed")),
    isApproved: v.boolean(),
    approvedBy: v.optional(v.string()),
    issueNumber: v.number(),
    openedBy: v.string(),
    body: v.string(),
    title: v.string(),
  }),
});
