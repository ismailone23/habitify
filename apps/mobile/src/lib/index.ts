import type { HabitOptions } from "@repo/db/schema";

import { TAILWIND_COLORS } from "@/constants/Colors";
import dayjs from "@/utils/dayjs";

export function buildDataForDots({
  habitId,
  habitOptions,
}: {
  habitId: string;
  habitOptions: HabitOptions[];
}) {
  const totalDays = 365;
  const endDate = dayjs().startOf("day");
  const startDate = endDate.subtract(totalDays - 1, "day");

  const paddedStart = startDate.startOf("isoWeek");

  const totalGridDays = endDate.diff(paddedStart, "day") + 1;
  const fullWeeks = Math.ceil(totalGridDays / 7);
  const finalLength = fullWeeks * 7;

  const allDates = Array.from({ length: finalLength }).map((_, i) => {
    return paddedStart.add(i, "day").format("YYYY-MM-DD");
  });

  const streaks = habitOptions.filter((s) => s.habitId === habitId);

  const result = allDates.map((dateStr) => {
    const match = streaks.find((s) =>
      dayjs(s.timestamp).isSame(dayjs(dateStr), "day")
    );
    return {
      date: dateStr,
      count: match ? match.streak : 0,
    };
  });

  return result;
}

export type TailwindColorName = keyof typeof TAILWIND_COLORS;
export type TailwindShade = keyof (typeof TAILWIND_COLORS)["red"];

export function getTailwindColor(
  color: string,
  shade = 500
): string | undefined {
  if (color in TAILWIND_COLORS) {
    return TAILWIND_COLORS[color as TailwindColorName][shade as TailwindShade];
  }
  return undefined;
}
