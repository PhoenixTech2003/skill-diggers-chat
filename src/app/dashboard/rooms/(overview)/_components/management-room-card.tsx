"use client";

import Link from "next/link";
import { Code2, MoreVertical } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { RenameRoomDialog } from "./rename-room-dialog";
import { DeleteRoomDialog } from "./delete-room-dialog";

type ManagementRoomCardProps = {
  id: string;
  name: string;
  createdAt: string | Date;
  isMember: boolean;
};

export function ManagementRoomCard({
  id,
  name,
  createdAt,
  isMember,
}: ManagementRoomCardProps) {
  const createdDate = new Date(createdAt);

  return (
    <Card className="bg-card overflow-hidden border">
      <div className="bg-muted flex items-center justify-center p-8">
        <Code2 className="text-primary h-12 w-12" />
      </div>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base leading-tight font-semibold">
            {name}
          </h3>
          <p className="text-muted-foreground mt-1 text-xs">
            Created {createdDate.toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isMember ? (
            <Button asChild>
              <Link href={`/dashboard/rooms/${id}`}>Go to room</Link>
            </Button>
          ) : (
            <Button variant="secondary">Join</Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Room options">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Room options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <RenameRoomDialog
                  roomId={id}
                  initialName={name}
                  trigger={<button className="w-full text-left">Rename</button>}
                />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteRoomDialog
                  roomId={id}
                  trigger={
                    <button className="text-destructive w-full text-left">
                      Delete
                    </button>
                  }
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
