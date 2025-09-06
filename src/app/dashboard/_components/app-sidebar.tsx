"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import {
  Code2,
  MessageSquare,
  Hash,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "~/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { AdminSidebarGroup } from "./admin-sidebar-group";
import { authClient } from "~/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

const availableRooms = [
  { id: 1, name: "JavaScript", members: 1234, active: true },
  { id: 2, name: "Python", members: 987, active: true },
  { id: 3, name: "React", members: 2156, active: true },
  { id: 4, name: "TypeScript", members: 876, active: false },
  { id: 5, name: "Go", members: 543, active: true },
  { id: 6, name: "C++", members: 432, active: false },
];

export function AppSidebar() {
  const [roomsExpanded, setRoomsExpanded] = useState(true);
  const pathname = usePathname();
  const { data: session, isPending, error } = authClient.useSession();
  const sessionErrorMessage = error
    ? error instanceof Error
      ? error.message
      : String(error)
    : null;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <Code2 className="text-primary h-8 w-8" />
          <span className="text-xl font-bold">Skill Diggers</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {sessionErrorMessage && (
          <SidebarGroup>
            <SidebarGroupContent>
              <ul>
                <li className="px-2">
                  <Alert variant="destructive">
                    <AlertTitle>Session error</AlertTitle>
                    <AlertDescription>{sessionErrorMessage}</AlertDescription>
                  </Alert>
                </li>
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                    <MessageSquare className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible open={roomsExpanded} onOpenChange={setRoomsExpanded}>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                Available Rooms
                {roomsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {isPending &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <SidebarMenuSkeleton key={i} />
                    ))}

                  {!isPending &&
                    availableRooms.map((room) => (
                      <SidebarMenuItem key={room.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/dashboard/rooms/${room.id}`}
                        >
                          <Link href={`/dashboard/rooms/${room.id}`}>
                            <Hash className="h-3 w-3" />
                            <span className="flex-1">{room.name}</span>
                            <div className="flex items-center gap-1">
                              {room.active && (
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {room.members}
                              </Badge>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        {session?.user?.role === "admin" && <AdminSidebarGroup />}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
            <span className="text-primary-foreground text-sm font-medium">
              JD
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {session?.user?.name}
            </p>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-muted-foreground text-xs">Online</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
