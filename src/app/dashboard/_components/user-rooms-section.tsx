"use client";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "~/lib/auth-client";
import { getAllRoomMemberShipByUserId } from "~/server/db/queries";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "~/components/ui/sidebar";
import { Hash } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export function UserRoomsSection() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: session,
    isPending: sessionPending,
    error: sessionError,
  } = authClient.useSession();
  if (!session) {
    router.push("/auth/login");
  }
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-rooms", session?.session?.userId],
    queryFn: () =>
      getAllRoomMemberShipByUserId({ userId: session!.session.userId }),
    enabled: !!session?.session?.userId,
  });

  if (sessionError) {
    return (
      <li className="px-2">
        <Alert variant="destructive">
          <AlertTitle>Session error</AlertTitle>
          <AlertDescription>
            {sessionError instanceof Error
              ? sessionError.message
              : String(sessionError)}
          </AlertDescription>
        </Alert>
      </li>
    );
  }

  if (sessionPending || isLoading) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <SidebarMenuSkeleton key={i} />
        ))}
      </>
    );
  }

  if (error) {
    return (
      <li className="px-2">
        <Alert variant="destructive">
          <AlertTitle>Could not load your rooms</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Unknown error"}
          </AlertDescription>
        </Alert>
      </li>
    );
  }

  const rooms = data?.roomMemberShip ?? [];
  if (rooms.length === 0) {
    return (
      <li className="px-2 py-1">
        <p className="text-muted-foreground text-xs">No joined rooms</p>
      </li>
    );
  }

  return (
    <>
      {rooms.map((room) => (
        <SidebarMenuItem key={room.roomId}>
          <SidebarMenuButton
            asChild
            isActive={pathname === `/dashboard/rooms/${room.roomId}`}
          >
            <Link href={`/dashboard/rooms/${room.roomId}`}>
              <Hash className="h-3 w-3" />
              <span className="flex-1">{room.roomName}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
