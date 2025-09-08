"use client";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Hash, LogOut } from "lucide-react";

interface RoomHeaderProps {
  room: {
    name: string;
    description: string;
    members: number;
  };
}

export function RoomHeader({ room }: RoomHeaderProps) {
  return (
    <div className="border-border bg-card sticky top-0 z-10 flex h-16 items-center justify-between border-b px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Hash className="text-primary h-5 w-5" />
          <h1 className="text-card-foreground text-xl font-semibold">
            {room.name}
          </h1>
          <Badge variant="secondary" className="text-xs">
            {room.members} members
          </Badge>
        </div>
        <div className="text-muted-foreground hidden text-sm md:block">
          {room.description}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="destructive" size="sm">
          <LogOut className="h-4 w-4" />
          <span>Leave</span>
        </Button>
      </div>
    </div>
  );
}
