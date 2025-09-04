import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const rooms = pgTable("room", {
  id: text("id").primaryKey().notNull().unique(),
  name: text("name").notNull().unique(),
  version: integer("version").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  bumpedAt: timestamp("bumped_at").defaultNow().notNull(),
});
