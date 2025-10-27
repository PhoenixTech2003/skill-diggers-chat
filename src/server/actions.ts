"use server";

import { env } from "~/env";

// API call to create a meeting
export const createMeeting = async () => {
  console.log(env.VIDEO_SDK_API_KEY);
  try {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
      method: "POST",
      headers: {
        authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJhNWM1OGU5Zi01ZWNkLTQ5MDktOGUwNC1lZGM5NmU3Zjc3NWQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc2MTU0Mzg2NiwiZXhwIjoxNzYyMTQ4NjY2fQ.0IlBvInQNTolKBfZdRN0dNVIm4-hBeYtnF4vIpfyMLg`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      // Try to get error details from response
      let errorMessage = `Failed to create meeting (Status: ${res.status} ${res.statusText})`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error("API Error Response:", {
          status: res.status,
          statusText: res.statusText,
          error: errorData,
        });
      } catch {
        // If response is not JSON, log the raw response
        const textResponse = await res.text();
        console.error("API Error Response (non-JSON):", {
          status: res.status,
          statusText: res.statusText,
          body: textResponse,
        });
      }
      throw new Error(errorMessage);
    }

    //Destructuring the roomId from the response
    const data: { roomId: string } = await res.json();
    console.log("Room created successfully, roomId:", data.roomId);
    return data.roomId;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};
