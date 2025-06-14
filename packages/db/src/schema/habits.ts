import { pgTable } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { relations } from "drizzle-orm";

export const habits = pgTable("habit", (t) => ({
  id: t.uuid("id").defaultRandom().primaryKey(),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t
    .timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  userId: t
    .uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: t.text("name").notNull(),
  description: t.text("description"),
  frequency: t
    .json("frequency")
    .$type<{
      type: "daily" | "custom" | "weekly";
      targetDays: string[] | null;
      targetCount: number;
      time: string;
    }>()
    .notNull(),
  startDate: t.timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: t.timestamp("end_date", { withTimezone: true }),
  color: t.text("color").notNull(),
  icon: t.text("icon").notNull(),
  status: t
    .text("status", {
      enum: ["active", "paused", "archived"],
    })
    .default("active")
    .notNull(),
  timezone: t.text("timezone").notNull(),
}));

export type Habits = typeof habits.$inferSelect;

export const habitOptions = pgTable("habit_option", (t) => ({
  id: t.uuid("habit_option_id").primaryKey().notNull().defaultRandom(),
  habitId: t
    .uuid("habit_id")
    .references(() => habits.id, { onDelete: "cascade" }),
  count: t.integer("count").notNull().default(1),
  createdAt: t
    .timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}));

export type HabitOptions = typeof habitOptions.$inferSelect;

export const habitRelations = relations(habits, ({ one }) => ({
  user: one(users, { fields: [habits.userId], references: [users.id] }),
  habitOptions: one(habitOptions, {
    fields: [habits.id],
    references: [habitOptions.habitId],
  }),
}));

export const habitOptionsRelation = relations(habitOptions, ({ one }) => ({
  habit: one(habits, {
    fields: [habitOptions.habitId],
    references: [habits.id],
  }),
}));
