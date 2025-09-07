import { getRooms } from "~/server/db/queries";
import { RoomCard } from "../../(overview)/_components/room-card";
import { CreateRoomDialog } from "./_components/create-room-dialog";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { isUserInRoom } from "~/lib/room-helpers";

export default async function RoomsManagementPage() {
  const { roomData, roomDataError } = await getRooms({ query: "" });
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });
  if (!sessionData) {
    redirect("/auth/login");
  }
  let content: React.ReactNode;
  if (roomDataError !== null) {
    content = (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="bg-card text-destructive border-destructive/30 mx-auto w-full max-w-md rounded-lg border p-6 text-center">
          <p className="text-sm">
            Failed to load rooms. Please try again later.
          </p>
        </div>
      </div>
    );
  } else if (roomData === null || roomData.length === 0) {
    content = (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="bg-card mx-auto w-full max-w-md rounded-lg border p-6 text-center">
          <p className="text-muted-foreground text-sm">
            No rooms to manage yet. Create one to get started.
          </p>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roomData.map(async (room) => {
          const isMember = await isUserInRoom({
            userId: sessionData.session.userId,
            roomId: room.id,
          });
          return (
            <RoomCard
              key={room.id}
              id={room.id}
              name={room.name}
              createdAt={room.createdAt}
              isMember={isMember}
            />
          );
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
