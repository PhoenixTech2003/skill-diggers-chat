"use client";

import { CreateRoomDialog } from "./create-room-dialog";
import type { api } from "../../../../../../convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { RoomCard } from "./room-card";

export default function RoomsManagementPage(props: {
  preloaded: Preloaded<typeof api.rooms.getRooms>;
}) {
  const { roomsData, roomsDataError } = usePreloadedQuery(props.preloaded);

  let content: React.ReactNode;
  if (roomsDataError !== null) {
    content = (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="bg-card text-destructive border-destructive/30 mx-auto w-full max-w-md rounded-lg border p-6 text-center">
          <p className="text-sm">
            Failed to load rooms. Please try again later.
          </p>
        </div>
      </div>
    );
  } else if (roomsData === null || roomsData.length === 0) {
    content = (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="bg-card mx-auto w-full max-w-md rounded-lg border p-6 text-center">
          <p className="text-muted-foreground text-sm">No rooms available</p>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roomsData.map((room) => {
          return <RoomCard key={room._id} room={room} />;
        })}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Manage your rooms here
          </h1>
          <p className="text-muted-foreground text-sm">
            Create, join, or jump into rooms you already belong to.
          </p>
        </div>
        <CreateRoomDialog />
      </div>
      {content}
    </div>
  );
}
