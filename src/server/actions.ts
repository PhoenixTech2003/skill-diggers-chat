"use server";

import { env } from "~/env";

export const authToken: string = env.VIDEO_SDK_API_KEY;

// API call to create a meeting
export const createMeeting = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
      method: "POST",
      headers: {
        authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    //Destructuring the roomId from the response
    const { roomId }: { roomId: string } = await res.json();
    return roomId;
  } catch (error) {
    console.error(error);
    return null;
  }
};
