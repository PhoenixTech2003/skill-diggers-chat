import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { rooms } from "./room";

export const messages = pgTable("message", {
  id: text("id").primaryKey().notNull(),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isLastMessage: boolean("is_last_message").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
