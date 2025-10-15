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
});
