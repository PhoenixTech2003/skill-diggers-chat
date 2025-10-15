"use client";

import { authClient } from "~/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function SidebarFooterUser() {
  const { data: session } = authClient.useSession();
  const initials = (session?.user?.name ?? "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
      </div>
    </div>
  );
}
