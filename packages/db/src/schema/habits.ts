import { pgTable } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { relations } from "drizzle-orm";

export const habits = pgTable("habit", (t) => ({
  id: t.uuid("habit_id").primaryKey().notNull().defaultRandom(),
  title: t.varchar("habit_title").notNull(),
  description: t.text("habit_description").notNull(),
  icon: t.varchar("habit_icon").notNull(),
  color: t.varchar("habit_color").notNull(),
  categoryId: t
    .uuid("category_id")
    .references(() => categories.id, { onDelete: "cascade" }),
  authorId: t
    .uuid("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  maxStreaks: t.integer("max_streaks").default(1),
  isArchived: t.boolean("is_archived").notNull().default(false),
  reminderEnabled: t.boolean("reminder_enabled").notNull().default(true),
  reminderFrequency: t
    .text("reminder_frequency")
    .$type<"Daily" | "Weekly" | "Custom" | "None">()
    .notNull()
    .default("None"),
  reminderTime: t.time("reminder_time").notNull(),
  reminderDays: t.json("reminder_days").notNull().$type<string[]>(),
  timezone: t.varchar("timezone").notNull(),
  createdAt: t.timestamp("created_at").notNull().defaultNow(),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
}));

export type Habits = typeof habits.$inferSelect;

export const categories = pgTable("category", (t) => ({
  id: t.uuid("category_id").primaryKey().notNull().defaultRandom(),
  categoryTitle: t.varchar("category_title").notNull(),
  icon: t.varchar("habit_icon").notNull(),
  createdAt: t.timestamp("created_at").defaultNow(),
}));

export const habitOptions = pgTable("habit_option", (t) => ({
  id: t.uuid("habit_option_id").primaryKey().notNull().defaultRandom(),

  habitId: t
    .uuid("habit_id")
    .references(() => habits.id, { onDelete: "cascade" }),

  streak: t.integer("max_streaks").notNull().default(1),
  timestamp: t.timestamp("created_at").notNull().defaultNow(),
}));

export type HabitOptions = typeof habitOptions.$inferSelect;

export const habitRelations = relations(habits, ({ one }) => ({
  user: one(users, { fields: [habits.authorId], references: [users.id] }),
  category: one(categories, {
    fields: [habits.categoryId],
    references: [categories.id],
  }),
  habitOptions: one(habitOptions, {
    fields: [habits.id],
    references: [habitOptions.habitId],
  }),
}));

export const categoriesRelation = relations(categories, ({ many }) => ({
  habits: many(habits),
}));

export const habitOptionsRelation = relations(habitOptions, ({ one }) => ({
  habit: one(habits, {
    fields: [habitOptions.habitId],
    references: [habits.id],
  }),
}));
