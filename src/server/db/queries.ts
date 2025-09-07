"use server";
import { db } from ".";
import { messages, roomMember, rooms } from "./schema";
import { and, eq, ilike } from "drizzle-orm";

export const getRooms = async function ({ query = "" }: { query?: string }) {
  try {
    const roomData = await db
      .select()
      .from(rooms)
      .where(ilike(rooms.name, `%${query}%`));
    return { roomData: roomData, roomDataError: null };
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    return { roomData: null, roomDataError: "Failed to load rooms" };
  }
};

export const getRoomMessages = async function ({ roomId }: { roomId: string }) {
  try {
    const roomMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.roomId, roomId));
    return { roomMessages: roomMessages, roomMessagesError: null };
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    return { roomMessages: null, roomMessagesError: error };
  }
};

export const getRoomMemberShipByUserId = async function ({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}) {
  try {
    const roomMemberShipData = await db
      .select()
      .from(roomMember)
      .where(and(eq(roomMember.userId, userId), eq(roomMember.roomId, roomId)));
    return { roomMemberShip: roomMemberShipData, roomMemberShipError: null };
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    return { roomMemberShip: null, roomMemberShipError: error };
  }
};

export const getAllRoomMemberShipByUserId = async function ({
  userId,
}: {
  userId: string;
}) {
  try {
    const roomMemberShipData = await db
      .select({
        roomId: roomMember.roomId,
        roomName: rooms.name,
      })
      .from(roomMember)
      .where(eq(roomMember.userId, userId))
      .innerJoin(rooms, eq(roomMember.roomId, rooms.id));
    return { roomMemberShip: roomMemberShipData, roomMemberShipError: null };
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    return { roomMemberShip: null, roomMemberShipError: "failed to get rooms" };
  }
};
