/* eslint-disable drizzle/enforce-delete-with-where */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
      console.log("Creating room", args.name);
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
      const roomMemberships = await ctx.db.query("roomMember").collect();
      const filteredRoomMemberships = roomMemberships.filter(
        (q) => q.roomId === args.roomId && q.userId === userdata._id,
      );
      const isMember = filteredRoomMemberships.length > 0 ? true : false;
      return isMember;
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
      const roomMemberships = await ctx.db.query("roomMember").collect();
      const filteredRoomMemberships = roomMemberships.filter(
        (q) => q.userId === userdata._id,
      );
      const userRooms = await Promise.all(
        filteredRoomMemberships.map(async (room) => {
          const roomDetails = await ctx.db.query("room").collect();
          const filteredRoomDetails = roomDetails.filter(
            (q) => q._id === room.roomId,
          );
          return filteredRoomDetails[0];
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
      await ctx.db.delete(roomId);
      const roomMemberships = await ctx.db.query("roomMember").collect();
      const filteredRoomMemberships = roomMemberships.filter(
        (q) => q.roomId === roomId,
      );
      await Promise.all(
        filteredRoomMemberships.map(async (roomMembership) => {
          await ctx.db.delete(roomMembership._id);
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
