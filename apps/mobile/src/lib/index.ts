import { TAILWIND_COLORS } from "@/constants/Icons";
import { HabitOptions } from "@repo/db/schema";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isSameDay,
  startOfWeek,
  subDays,
} from "date-fns";

export function buildDataForDots({
  habitId,
  habitOptions,
}: {
  habitId: string;
  habitOptions: HabitOptions[];
}) {
  const totalDays = 365;
  const endDate = new Date();
  const startDate = subDays(endDate, totalDays - 1);

  const weekStartsOnMonday = true;
  const paddedStart = startOfWeek(startDate, {
    weekStartsOn: weekStartsOnMonday ? 1 : 0,
  });

  const totalGridDays = differenceInCalendarDays(endDate, paddedStart) + 1;
  const fullWeeks = Math.ceil(totalGridDays / 7);
  const finalLength = fullWeeks * 7;

  const allDates = Array.from({ length: finalLength }).map((_, i) => {
    const date = addDays(paddedStart, i);
    return format(date, "yyyy-MM-dd");
  });

  const streaks = habitOptions.filter((s) => s.habitId === habitId);

  const result = allDates.map((dateStr) => {
    const match = streaks.find((s) =>
      isSameDay(s.timestamp, parseDate(dateStr))
    );
    return {
      date: dateStr,
      count: match ? match.streak : 0,
    };
  });

  return result;
}

function parseDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00");
}

export type TailwindColorName = keyof typeof TAILWIND_COLORS;
export type TailwindShade = keyof (typeof TAILWIND_COLORS)["red"];

export function getTailwindColor(
  color: string,
  shade: number = 500
): string | undefined {
  if (color in TAILWIND_COLORS) {
    return TAILWIND_COLORS[color as TailwindColorName][shade as TailwindShade];
  }
  return undefined;
}
