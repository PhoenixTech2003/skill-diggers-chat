import { db } from ".";
import { rooms } from "./schema";
import { ilike } from "drizzle-orm";

export const getRooms = async function ({ query }: { query: string }) {
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
