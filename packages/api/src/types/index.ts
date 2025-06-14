import { HabitOptions, Habits } from "@repo/db/schema";

export type HabitDataType = {
  habit: Habits;
  options: HabitOptions[];
};
