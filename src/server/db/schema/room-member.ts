import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { rooms } from "./room";

export const roomMember = pgTable("room_member", {
  id: text("id").primaryKey().notNull(),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});
