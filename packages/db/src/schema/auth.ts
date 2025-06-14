import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { habits } from "./habits";

export const users = pgTable("user", (t) => ({
  id: t.uuid("id").notNull().primaryKey().defaultRandom(),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  isAnonymous: t.boolean("is_anonymous").default(false).notNull(),
  updatedAt: t
    .timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: t.varchar("name", { length: 255 }),
  email: t.varchar("email", { length: 255 }).unique(),
  expoPushToken: t.varchar("expo_push_token", { length: 255 }),
  emailVerified: t.timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }),
  image: t.varchar("image", { length: 255 }),
}));

export type User = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  habits: many(habits),
}));
