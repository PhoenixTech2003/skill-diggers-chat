"use server";

import { auth } from "~/lib/auth";
import { createRoom } from "./db/schema/mutations";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { CreateRoomFormType } from "~/types/rooms";
import {
  createRoomMember,
  deleteRoom,
  updateRoomName,
} from "./db/schema/mutations";

export const createRoomAction = async function ({ name }: CreateRoomFormType) {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      redirect("/auth/login");
    }
    const userId = sessionData.session.userId;
    const room = await createRoom({ name, userId });
    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard");
    return room;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    throw new Error("Failed to create room");
  }
};

export const updateRoomNameAction = async function ({
  roomId,
  name,
}: {
  roomId: string;
  name: string;
}) {
  try {
    const sessionData = await auth.api.getSession({ headers: await headers() });
    if (!sessionData) {
      redirect("/auth/login");
    }
    const updated = await updateRoomName({ roomId, name });
    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard");
    return updated;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    throw new Error("Failed to update room name");
  }
};

export const deleteRoomAction = async function ({
  roomId,
}: {
  roomId: string;
}) {
  try {
    const sessionData = await auth.api.getSession({ headers: await headers() });
    if (!sessionData) {
      redirect("/auth/login");
    }
    const deleted = await deleteRoom({ roomId });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/rooms");
    return deleted;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    throw new Error("Failed to delete room");
  }
};

export const joinRoomAction = async function ({ roomId }: { roomId: string }) {
  try {
    const sessionData = await auth.api.getSession({ headers: await headers() });
    if (!sessionData) {
      redirect("/auth/login");
    }
    const userId = sessionData.session.userId;
    const joined = await createRoomMember({ roomId, userId });
    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard");
    return joined;
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    throw new Error("Failed to join room");
  }
};
