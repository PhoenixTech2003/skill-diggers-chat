import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import RoomsManagementPage from "./_components/room-managment-page";

export default async function RoomManagmentPageServer() {
  const roomsData = await preloadQuery(api.rooms.getRooms);
  return <RoomsManagementPage preloaded={roomsData} />;
}
