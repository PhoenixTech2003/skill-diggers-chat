/* eslint-disable drizzle/enforce-delete-with-where */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { authComponent } from "./auth";

export const getRooms = query({
  args: {},
  handler: async (ctx) => {
    try {
      const rooms = await ctx.db.query("room").collect();
      return { roomsData: rooms, roomsDataError: null };
    } catch (error) {
      console.error(error);
      return { roomsData: null, roomsDataError: "Failed to get rooms" };
    }
  },
});

export const createRoom = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userdata = await authComponent.getAuthUser(ctx);

      if (userdata.role != "admin") {
        throw Error("You Are not authorized to create a room");
      }
      const loggedInUserId = userdata._id;
      console.log("Logged in user ID", loggedInUserId);
      const room = await ctx.db.insert("room", {
        name: args.name,
        createdBy: loggedInUserId,
      });
      return room;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const checkMembership = query({
  args: {
    roomId: v.id("room"),
  },
  handler: async (ctx, args) => {
    try {
      const userdata = await authComponent.getAuthUser(ctx);
      const membership = await ctx.db
        .query("roomMember")
        .withIndex("by_room_user", (q) =>
          q.eq("roomId", args.roomId).eq("userId", userdata._id),
        )
        .first();
      return membership !== null;
    } catch (checkMembershipError) {
      console.error(
        checkMembershipError instanceof Error
          ? checkMembershipError.message
          : "an unknown error occured while checking memebership",
      );
      return false;
    }
  },
});

export const getAllRoomMemberShipByUserId = query({
  handler: async (ctx) => {
    try {
      const userdata = await authComponent.getAuthUser(ctx);
      const filteredRoomMemberships = await ctx.db
        .query("roomMember")
        .withIndex("by_user", (q) => q.eq("userId", userdata._id))
        .collect();

      const userRooms = await Promise.all(
        filteredRoomMemberships.map(async (membership) => {
          const roomDetails = await ctx.db.get(membership.roomId);
          return roomDetails!;
        }),
      );
      return { userRoomsData: userRooms, userRoomsDataError: null };
    } catch (error) {
      console.error(error);
      return {
        userRoomsData: null,
        userRoomsDataError: "Failed to get user rooms",
      };
    }
  },
});

export const updateRoomName = mutation({
  args: {
    roomId: v.id("room"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userData = await authComponent.getAuthUser(ctx);
      if (userData.role !== "admin") {
        throw new Error("You are not authorized to rename this room");
      }
      const { roomId } = args;
      const room = await ctx.db.get(roomId);
      if (!room) {
        throw new Error("Room not found");
      }
      await ctx.db.patch(roomId, { name: args.name });
      const updatedRoom = await ctx.db.get(roomId);
      return updatedRoom;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const deleteRoom = mutation({
  args: {
    roomId: v.id("room"),
  },
  handler: async (ctx, args) => {
    try {
      const { roomId } = args;
      const userData = await authComponent.getAuthUser(ctx);
      if (userData.role !== "admin") {
        throw new Error("You are not authorized to delete this room");
      }
      await ctx.db.delete(roomId);
      const roomMemberships = await ctx.db
        .query("roomMember")
        .withIndex("by_room", (q) => q.eq("roomId", roomId))
        .collect();
      await Promise.all(
        roomMemberships.map(async (roomMembership) => {
          await ctx.db.delete(roomMembership._id);
        }),
      );

      const roomMessages = await ctx.db
        .query("message")
        .withIndex("by_room", (q) => q.eq("roomId", roomId))
        .collect();
      await Promise.all(
        roomMessages.map(async (message) => {
          await ctx.db.delete(message._id);
        }),
      );
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const joinRoom = mutation({
  args: {
    roomId: v.id("room"),
  },
  handler: async (ctx, args) => {
    try {
      const userData = await authComponent.getAuthUser(ctx);
      await ctx.db.insert("roomMember", {
        roomId: args.roomId,
        userId: userData._id,
      });
      const roomDetails = await ctx.db.get(args.roomId);
      return roomDetails;
    } catch (joinRoomError) {
      console.error(joinRoomError);
      throw joinRoomError;
    }
  },
});

export const getRoomDetails = query({
  args: {
    roomId: v.id("room"),
  },
  handler: async (ctx, args) => {
    try {
      const roomDetails = await ctx.db.get(args.roomId);
      const filteredRoomMemberships = await ctx.db
        .query("roomMember")
        .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
        .collect();

      return {
        roomData: {
          details: roomDetails,
          members: filteredRoomMemberships.length,
        },
        roomDataError: null,
      };
    } catch (error) {
      console.error(error);
      return { roomData: null, roomDataError: "Failed to get room details" };
    }
  },
});

export const leaveRoom = mutation({
  args: {
    roomId: v.id("room"),
  },
  handler: async (ctx, args) => {
    try {
      const userData = await authComponent.getAuthUser(ctx);
      const membership = await ctx.db
        .query("roomMember")
        .withIndex("by_room_user", (q) =>
          q.eq("roomId", args.roomId).eq("userId", userData._id),
        )
        .first();
      if (!membership) {
        throw new Error("You are not a member of this room");
      }
      await ctx.db.delete(membership._id);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const roomExists = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId as Id<"room">);
    return room !== null;
  },
});
