"use client";

import { io } from "socket.io-client";
import { env } from "~/env";

export const socket = io(env.NEXT_PUBLIC_SOCKET_IO_WEB_SERVER_URL);
