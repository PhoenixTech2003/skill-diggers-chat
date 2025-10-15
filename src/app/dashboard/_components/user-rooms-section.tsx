"use client";
import { authClient } from "~/lib/auth-client";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
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
  const pathname = usePathname();
  const router = useRouter();
  const {
    data: session,
    isPending: sessionPending,
    error: sessionError,
  } = authClient.useSession();
  if (!session) {
    router.push("/auth/login");
  }
  const roomMembershipsData = useQuery(api.rooms.getAllRoomMemberShipByUserId);

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

  if (sessionPending || roomMembershipsData == undefined) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <SidebarMenuSkeleton key={i} />
        ))}
      </>
    );
  }

  if (roomMembershipsData.userRoomsDataError) {
    return (
      <li className="px-2">
        <Alert variant="destructive">
          <AlertTitle>Could not load your rooms</AlertTitle>
          <AlertDescription>
            {roomMembershipsData.userRoomsDataError}
          </AlertDescription>
        </Alert>
      </li>
    );
  }

  const rooms = roomMembershipsData.userRoomsData ?? [];
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
        <SidebarMenuItem key={room!._id}>
          <SidebarMenuButton
            asChild
            isActive={pathname === `/dashboard/rooms/${room!._id}`}
          >
            <Link href={`/dashboard/rooms/${room!._id}`}>
              <Hash className="h-3 w-3" />
              <span className="flex-1">{room!.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
