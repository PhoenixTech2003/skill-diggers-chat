"use server";

import { env } from "~/env";

// API call to create a meeting
export const createMeeting = async (region?: string) => {
  const tokenRes = await fetch(`${env.BASE_URL}/api/video-sdk/get-token`, {
    method: "GET",
    // Avoid any caching surprises for auth-like values
    cache: "no-store",
  });
  if (!tokenRes.ok) {
    throw new Error("Failed to get token");
  }
  const tokenData: { token?: string } = await tokenRes.json();
  if (!tokenData.token) {
    throw new Error("Token is required");
  }
  try {
    const res = await fetch("https://api.videosdk.live/v2/rooms", {
      method: "POST",
      headers: {
        // VideoSDK expects the JWT as the Authorization header value
        Authorization: tokenData.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(region ? { region } : {}),
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
