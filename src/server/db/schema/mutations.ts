import { messages } from "./message";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../index";
import { createId } from "@paralleldrive/cuid2";
import { rooms } from "./room";
import { roomMember } from "./room-member";
import type { CreateRoomParamType } from "~/types/rooms";

export const createMessage = async function ({
  roomId,
  userId,
  content,
}: {
  roomId: string;
  userId: string;
  content: string;
}) {
  try {
    const createMessageResult = await db.transaction(async (tx) => {
      try {
        await tx
          .update(messages)
          .set({ isLastMessage: false })
          .where(
            and(eq(messages.roomId, roomId), eq(messages.isLastMessage, true)),
          );

        await tx.insert(messages).values({
          id: createId(),
          roomId,
          userId,
          content,
          isLastMessage: true,
        });
        const [updatedRoom] = await tx
          .update(rooms)
          .set({
            version: sql`${rooms.version} + 1`,
            bumpedAt: sql`now()`,
          })
          .where(eq(rooms.id, roomId))
          .returning();

        return {
          room: updatedRoom,
          error: null,
        };
      } catch (error) {
        console.log(error instanceof Error ? error.message : "Unknown error");
        tx.rollback();
        throw error;
      }
    });
    return createMessageResult;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
};

export const createRoomMember = async function ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  try {
    const createRoomMemberResult = await db.transaction(async (tx) => {
      try {
        const [createdRoomMember] = await tx
          .insert(roomMember)
          .values({
            id: createId(),
            roomId,
            userId,
          })
          .returning();

        await tx
          .update(rooms)
          .set({
            version: sql`${rooms.version} + 1`,
          })
          .where(eq(rooms.id, roomId));

        return createdRoomMember;
      } catch (error) {
        console.log(error instanceof Error ? error.message : "Unknown error");
        tx.rollback();
        throw error;
      }
    });

    return createRoomMemberResult;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
};

export const deleteRoomMember = async function ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  try {
    const deleteRoomMemberResult = await db.transaction(async (tx) => {
      try {
        await tx
          .delete(roomMember)
          .where(
            and(eq(roomMember.roomId, roomId), eq(roomMember.userId, userId)),
          );

        await tx
          .update(rooms)
          .set({
            version: sql`${rooms.version} + 1`,
          })
          .where(eq(rooms.id, roomId));
      } catch (error) {
        console.log(error instanceof Error ? error.message : "Unknown error");
        tx.rollback();
        throw error;
      }
    });
    return deleteRoomMemberResult;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
};

export const createRoom = async function ({
  name,
  userId,
}: CreateRoomParamType) {
  try {
    const createRoomResult = await db.transaction(async (tx) => {
      try {
        const [createdRoom] = await tx
          .insert(rooms)
          .values({
            id: createId(),
            name,
            createdBy: userId,
          })
          .returning();

        return createdRoom;
      } catch (error) {
        console.log(error instanceof Error ? error.message : "Unknown error");
        tx.rollback();
        throw error;
      }
    });
    return createRoomResult;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
};

export const updateRoomName = async function ({
  roomId,
  name,
}: {
  roomId: string;
  name: string;
}) {
  try {
    const [updatedRoom] = await db
      .update(rooms)
      .set({
        name,
        version: sql`${rooms.version} + 1`,
        bumpedAt: sql`now()`,
      })
      .where(eq(rooms.id, roomId))
      .returning();
    return updatedRoom;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
};

export const deleteRoom = async function ({ roomId }: { roomId: string }) {
  try {
    const result = await db.transaction(async (tx) => {
      try {
        await tx.delete(messages).where(eq(messages.roomId, roomId));
        await tx.delete(roomMember).where(eq(roomMember.roomId, roomId));
        const [deleted] = await tx
          .delete(rooms)
          .where(eq(rooms.id, roomId))
          .returning();
        return deleted;
      } catch (error) {
        console.log(error instanceof Error ? error.message : "Unknown error");
        tx.rollback();
        throw error;
      }
    });
    return result;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
};
