import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const rooms = pgTable("room", {
  id: text("id").primaryKey().notNull().unique(),
  name: text("name").notNull().unique(),
  version: integer("version").default(0).notNull(),
  createdBy: text("created_by")
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  bumpedAt: timestamp("bumped_at").defaultNow().notNull(),
});
