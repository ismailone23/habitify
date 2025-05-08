import { HabitOptions, Habits } from "@repo/db/schema";

export type habitData = {
  habit: Habits;
  habitOptions: HabitOptions[];
  isCompletedToday: boolean;
};
