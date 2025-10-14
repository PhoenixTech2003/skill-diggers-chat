import { getRooms } from "~/server/db/queries";
import { RoomCard } from "./_components/room-card";
import { isUserInRoom } from "~/lib/room-helpers";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { getToken } from "~/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardOverviewPage() {
  const token = await getToken();
  const { roomData, roomDataError } = await getRooms({ query: "" });
  const { sessionData, sessionDataError } = await fetchQuery(
    api.users.getLoggedUserSession,
    {},
    { token },
  );
  if (!sessionData?.session) {
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
  } else if (!roomData || roomData.length === 0) {
    content = (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="bg-card mx-auto w-full max-w-md rounded-lg border p-6 text-center">
          <p className="text-muted-foreground text-sm">
            Hmm... looks like there are no rooms yet. Might want to talk to the
            admins about this
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
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">
          Join or go to a room
        </h1>
        <p className="text-muted-foreground text-sm">
          Explore available rooms to start chatting, or jump back into one
          you&apos;ve already joined.
        </p>
      </div>
      {content}
    </div>
  );
}
