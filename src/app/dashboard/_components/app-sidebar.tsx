"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Trophy,
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
import { SidebarFooterUser } from "./sidebar-footer";
import { UserRoomsSection } from "./user-rooms-section";

export function AppSidebar() {
  const [roomsExpanded, setRoomsExpanded] = useState(true);
  const [competitionsExpanded, setCompetitionsExpanded] = useState(true);
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

                  {!isPending && <UserRoomsSection />}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        <SidebarGroup>
          <Collapsible
            open={competitionsExpanded}
            onOpenChange={setCompetitionsExpanded}
          >
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                Competions
                {competitionsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/board"}
                    >
                      <Link href="/dashboard/board">
                        <Trophy className="h-4 w-4" />
                        <span>The Board</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        {session?.user?.role === "admin" && <AdminSidebarGroup />}
      </SidebarContent>

      <SidebarFooter>
        <SidebarFooterUser />
      </SidebarFooter>
    </Sidebar>
  );
}
