import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import DiscoverRoomsOverviewPage from "./_components/discover-overview-page";
import { getToken } from "~/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DiscoverRoomsOverviewPageServer() {
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
  const roomsData = await preloadQuery(api.rooms.getRooms);
  return <DiscoverRoomsOverviewPage preloaded={roomsData} />;
}
