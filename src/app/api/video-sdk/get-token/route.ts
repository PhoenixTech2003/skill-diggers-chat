import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET(request: Request) {
  const API_KEY = env.VIDEO_SDK_API_KEY;
  const SECRET_KEY = env.VIDEO_SDK_API_SECRET;

  // Optional params (mirrors VideoSDK reference server behavior)
  const url = new URL(request.url);
  const roomId = url.searchParams.get("roomId") ?? undefined;
  const peerId = url.searchParams.get("peerId") ?? undefined;

  const options = {
    expiresIn: "2h",
    algorithm: "HS256",
  } satisfies jwt.SignOptions;

  // IMPORTANT: VideoSDK expects `apikey` (lowercase) in the JWT payload.
  const payload: Record<string, unknown> = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod"],
  };

  // Optionally add the version/roles/roomId/participantId for v2 meeting join tokens
  if (roomId || peerId) {
    payload.version = 2;
    payload.roles = ["rtc"];
  }
  if (roomId) payload.roomId = roomId;
  if (peerId) payload.participantId = peerId;

  const token = jwt.sign(payload, SECRET_KEY, options);
  return NextResponse.json({ token });
}