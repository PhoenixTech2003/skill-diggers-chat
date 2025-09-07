"use server";

import { auth } from "~/lib/auth";
import { createRoom } from "./db/schema/mutations";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { CreateRoomFormType } from "~/types/rooms";

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
