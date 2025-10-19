"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, History, ChevronDown, ChevronRight } from "lucide-react";
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
} from "~/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import type { ChangelogMetadata } from "~/lib/changelog";

interface ChangelogSidebarProps {
  changelogItems: ChangelogMetadata[];
}

export function ChangelogSidebar({ changelogItems }: ChangelogSidebarProps) {
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/changelog" className="flex items-center gap-2 px-2 py-1">
          <Code2 className="text-primary h-8 w-8" />
          <span className="text-xl font-bold">Skill Diggers</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/changelog"}>
                  <Link href="/changelog">
                    <History className="h-4 w-4" />
                    <span>Latest</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible open={historyExpanded} onOpenChange={setHistoryExpanded}>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                History
                {historyExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {changelogItems.map((item) => (
                    <SidebarMenuItem key={item.slug}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/changelog/${item.slug}`}
                      >
                        <Link href={`/changelog/${item.slug}`}>
                          <span className="text-sm">{item.date}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <Code2 className="text-primary h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Changelog</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
