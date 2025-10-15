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
  }),
});
