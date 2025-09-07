"use server";

import { getRoomMemberShipByUserId } from "~/server/db/queries";

export const isUserInRoom = async function ({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}) {
  try {
    const { roomMemberShip, roomMemberShipError } =
      await getRoomMemberShipByUserId({
        userId,
        roomId,
      });
    if (roomMemberShipError) {
      return false;
    }
    if (!roomMemberShip) {
      return false;
    }
    return roomMemberShip.length > 0;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    return false;
  }
};
