"use client";
import { type getAllRoomMemberShipByUserId } from "~/server/db/queries";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { Hash } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { use } from "react";

export function UserRoomsSection({
  userRoomMembershipPromise,
}: {
  userRoomMembershipPromise: ReturnType<typeof getAllRoomMemberShipByUserId>;
}) {
  const pathname = usePathname();
  const { roomMemberShip, roomMemberShipError } = use(
    userRoomMembershipPromise,
  );

  if (roomMemberShipError) {
    return (
      <li className="px-2">
        <Alert variant="destructive">
          <AlertTitle>Could not load your rooms</AlertTitle>
          <AlertDescription>{roomMemberShipError}</AlertDescription>
        </Alert>
      </li>
    );
  }

  const rooms = roomMemberShip ?? [];
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
