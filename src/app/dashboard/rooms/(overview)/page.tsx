import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import RoomsManagementPage from "./_components/room-managment-page";
import { getToken } from "~/lib/auth-server";
import { redirect } from "next/navigation";

export default async function RoomManagmentPageServer() {
  const token = await getToken();
  const { sessionData, sessionDataError } = await fetchQuery(
    api.users.getLoggedUserSession,
    {},
    { token },
  );
  if (sessionDataError) {
    throw new Error(sessionDataError);
  }
  if (!sessionData?.session) {
    redirect("/auth/login");
  }
  if (sessionData?.user.role !== "admin") {
    redirect("/dashboard");
  }
  const roomsData = await preloadQuery(api.rooms.getRooms);
  return <RoomsManagementPage preloaded={roomsData} />;
}
