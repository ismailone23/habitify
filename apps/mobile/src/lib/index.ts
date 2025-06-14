import type { HabitOptions } from "@repo/db/schema";

import dayjs from "@/utils/dayjs";
import { COLORS } from "@/data/colors";

export function buildDataForDots({
  habitId,
  options,
}: {
  habitId: string;
  options: HabitOptions[];
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

  const streaks = options.filter((s) => s.habitId === habitId);

  const result = allDates.map((dateStr) => {
    const match = streaks.find((s) =>
      dayjs(s.createdAt).isSame(dayjs(dateStr), "day")
    );
    return {
      date: dateStr,
      count: match ? match.count : 0,
    };
  });

  return result;
}

const GROUP_SIZE = 11;

export function getColorGroup(hex: string): string[] {
  const index = COLORS.findIndex((c) => c.toLowerCase() === hex.toLowerCase());
  if (index === -1) return [];

  const groupStart = Math.floor(index / GROUP_SIZE) * GROUP_SIZE;
  return COLORS.slice(groupStart, groupStart + GROUP_SIZE);
}

const MAX_COLOR_LEVEL = 5;

export function getColorWithLevel(
  color: string,
  count: number,
  targetCount: number
): string {
  const ratio = Math.min(count / targetCount, 1); // clamp at 1
  const level = Math.round(ratio * MAX_COLOR_LEVEL);

  const group = getColorGroup(color);

  return group[level] ?? group[group.length - 1] ?? color;
}
