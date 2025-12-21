import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  room: defineTable({
    name: v.string(),
    createdBy: v.string(),
  }),
  videoRoom: defineTable({
    videosdkRoomId: v.string(),
    title: v.string(),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_videosdk_room_id", ["videosdkRoomId"])
    .index("by_created_by", ["createdBy"]),
  videoParticipant: defineTable({
    videosdkRoomId: v.string(),
    userId: v.string(),
    status: v.union(v.literal("ACTIVE"), v.literal("LEFT")),
    joinedAt: v.number(),
    lastActiveAt: v.number(),
    leftAt: v.optional(v.number()),
  })
    .index("by_room_user", ["videosdkRoomId", "userId"])
    .index("by_room", ["videosdkRoomId"])
    .index("by_user", ["userId"]),
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
    issueUrl: v.optional(v.string()),
    points: v.number(),
    status: v.union(v.literal("open"), v.literal("closed")),
    isApproved: v.boolean(),
    approvedBy: v.optional(v.string()),
    issueNumber: v.optional(v.number()),
    openedBy: v.string(),
    body: v.string(),
    title: v.string(),
  })
    .index("by_status_approved", ["status", "isApproved"])
    .index("by_opened_by", ["openedBy"])
    .index("by_approved_by", ["approvedBy"]),
  issueUsers: defineTable({
    issueId: v.id("githubIssue"),
    userId: v.string(),
    branchName: v.string(),
    pullRequestIsOpened: v.optional(v.boolean()),
    status: v.union(
      v.literal("accepted"),
      v.literal("in_progress"),
      v.literal("under_review"),
      v.literal("completed"),
      v.literal("abandoned"),
    ),
  })
    .index("by_issue_user", ["issueId", "userId"])
    .index("by_user", ["userId"])
    .index("by_issue", ["issueId"]),
  leaderboard: defineTable({
    userId: v.string(),
    points: v.number(),
  })
    .index("by_points", ["points"])
    .index("by_user", ["userId"]),
  bountyComment: defineTable({
    issueUserId: v.id("issueUsers"),
    userId: v.string(),
    message: v.string(),
    isAdminMessage: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_issue_user", ["issueUserId"])
    .index("by_user", ["userId"]),
  bountyCommentRead: defineTable({
    commentId: v.id("bountyComment"),
    userId: v.string(),
    readAt: v.number(),
  })
    .index("by_comment_user", ["commentId", "userId"])
    .index("by_user", ["userId"]),
  hackathons: defineTable({
    title: v.string(),
    description: v.string(),
    fullDescription: v.string(),
    registrationStart: v.string(), // ISO date string
    registrationEnd: v.string(), // ISO date string
    hackathonStart: v.string(), // ISO date string
    hackathonEnd: v.string(), // ISO date string
    location: v.union(v.literal("virtual"), v.literal("in-person"), v.literal("hybrid")),
    maxParticipants: v.number(),
    prize: v.string(), // e.g., "$10,000" or "5,000 points"
    prizeType: v.union(v.literal("cash"), v.literal("points")),
    status: v.union(
      v.literal("open"),
      v.literal("upcoming"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("closed"),
    ),
    requireLinkedIn: v.boolean(),
    linkedInPostsRequired: v.optional(v.number()),
    allowTeams: v.boolean(),
    rules: v.array(v.string()),
    prizes: v.array(
      v.object({
        place: v.string(),
        amount: v.string(),
      }),
    ),
    schedule: v.array(
      v.object({
        time: v.string(),
        event: v.string(),
      }),
    ),
    createdBy: v.string(), // userId
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created_by", ["createdBy"])
    .index("by_registration_period", ["registrationStart", "registrationEnd"])
    .index("by_event_period", ["hackathonStart", "hackathonEnd"]),
  hackathonRegistrations: defineTable({
    hackathonId: v.id("hackathons"),
    userId: v.string(),
    registrationType: v.union(v.literal("individual"), v.literal("team")),
    teamName: v.optional(v.string()),
    registeredAt: v.number(),
  })
    .index("by_hackathon", ["hackathonId"])
    .index("by_user", ["userId"])
    .index("by_hackathon_user", ["hackathonId", "userId"]),
  hackathonTeamMembers: defineTable({
    registrationId: v.id("hackathonRegistrations"),
    userId: v.string(), // Email or userId of team member
    addedAt: v.number(),
  })
    .index("by_registration", ["registrationId"])
    .index("by_user", ["userId"]),
  hackathonSubmissions: defineTable({
    hackathonId: v.id("hackathons"),
    registrationId: v.id("hackathonRegistrations"),
    liveLink: v.string(),
    githubLink: v.string(),
    linkedInPosts: v.array(v.string()),
    submittedAt: v.number(),
    position: v.optional(
      v.union(
        v.literal("1st Place"),
        v.literal("2nd Place"),
        v.literal("3rd Place"),
        v.literal("Honorable Mention"),
      ),
    ),
    resultsPublished: v.optional(v.boolean()),
  })
    .index("by_hackathon", ["hackathonId"])
    .index("by_registration", ["registrationId"])
    .index("by_position", ["position"]),
});
