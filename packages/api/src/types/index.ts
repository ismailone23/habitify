import type { HabitOptions, Habits } from "@repo/db/schema";

export interface habitData {
  habit: Habits;
  habitOptions: HabitOptions[];
  isCompletedToday: boolean;
}
