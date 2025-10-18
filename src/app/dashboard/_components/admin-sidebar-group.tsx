import { SidebarGroup, SidebarGroupLabel } from "~/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

import { ChevronDown, ChevronRight, MessageSquare, Trophy } from "lucide-react";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { SidebarGroupContent } from "~/components/ui/sidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";

const adminItems = [
  {
    href: "/dashboard/rooms/",
    label: "Rooms",
    icon: MessageSquare,
  },
  {
    href: "/dashboard/board/admin",
    label: "The Board",
    icon: Trophy,
  },
];

export function AdminSidebarGroup() {
  const [adminExpanded, setAdminExpanded] = useState(true);
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <Collapsible open={adminExpanded} onOpenChange={setAdminExpanded}>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            Administration
            {adminExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-3 w-3" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}
