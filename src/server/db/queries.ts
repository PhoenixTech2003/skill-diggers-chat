import { db } from ".";
import { messages, rooms } from "./schema";
import { eq, ilike } from "drizzle-orm";

export const getRooms = async function ({ query = "" }: { query?: string }) {
  try {
    const roomData = await db
      .select()
      .from(rooms)
      .where(ilike(rooms.name, `%${query}%`));
    return { roomData: roomData, roomDataError: null };
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    return { roomData: null, roomDataError: error };
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
