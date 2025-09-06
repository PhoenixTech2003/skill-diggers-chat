"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Bell, Search, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function DashboardHeader() {
  return (
    <header className="border-border bg-card flex h-16 items-center justify-between border-b px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="bg-blue-600 text-white hover:bg-blue-700" />

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search rooms, users, or messages..."
            className="bg-input border-border w-64 pl-10"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-primary-foreground text-sm font-medium">
                  JD
                </span>
              </div>
              <span className="hidden text-sm font-medium md:block">
                John Doe
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
