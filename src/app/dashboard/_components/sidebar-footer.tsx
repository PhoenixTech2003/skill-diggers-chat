"use client";

import { authClient } from "~/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { socket } from "~/server/socket-client/socket";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

export function SidebarFooterUser() {
  const [isOnline, setIsOnline] = useState(false);
  const { data: session } = authClient.useSession();
  const initials = (session?.user?.name ?? "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  useEffect(() => {
    function onConnect() {
      setIsOnline(true);
    }
    function onDisconnect() {
      setIsOnline(false);
    }
    if (socket.connected) {
      onConnect();
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  });

  return (
    <div className="flex items-center gap-3 p-2">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={session?.user?.image ?? undefined}
          alt={session?.user?.name ?? "User"}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{session?.user?.name}</p>
        <div className="flex items-center gap-1">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              isOnline ? "bg-green-500" : "bg-red-500",
            )}
          />
          <p className="text-muted-foreground text-xs">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}
