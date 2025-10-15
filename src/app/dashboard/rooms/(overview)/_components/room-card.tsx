import { api } from "../../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { ManagementRoomCard } from "./management-room-card";

interface RoomListProps {
  room: NonNullable<
    (typeof api.rooms.getRooms)["_returnType"]["roomsData"]
  >[number];
}

export function RoomCard(props: RoomListProps) {
  const isMember = useQuery(api.rooms.checkMembership, {
    userId: props.room.createdBy,
    roomId: props.room._id,
  });

  const createdDate = new Date(props.room._creationTime);

  return (
    <ManagementRoomCard
      id={props.room._id}
      name={props.room.name}
      createdAt={createdDate}
      isMember={isMember! || false}
    />
  );
}
