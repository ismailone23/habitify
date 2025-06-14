import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { BodyInit, Client } from "@upstash/qstash";

import { qstashClient } from "./qstash";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ReminderPayload {
  name: string;
  description: string | null;
  pushtoken: string;
}

const BASE_URL = "https://habitify-tawny.vercel.app";

export async function scheduleReminder({
  targetCount,
  type,
  targetDays,
  time,
  timezone,
  pushtoken,
  description,
  name,
}: {
  type: "custom" | "daily" | "weekly";
  targetCount: number;
  time: string;
  targetDays?:
    | ("sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat")[]
    | null
    | undefined;
  timezone: string;
  pushtoken: string;
  description: string | null;
  name: string;
}) {
  const [hourStr, minuteStr] = time.split(":");

  // Validate first
  if (!hourStr || !minuteStr) {
    throw new Error(`Invalid reminderTime format: "${time}"`);
  }

  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (isNaN(hour) || isNaN(minute)) {
    throw new Error(`Invalid time value: "${time}"`);
  }

  const now = dayjs().tz(timezone);
  const scheduledTime = now.hour(hour).minute(minute).second(0);

  // Get UTC time components
  const utcHour = scheduledTime.utc().hour();
  const utcMinute = scheduledTime.utc().minute();

  const dayMap: Record<string, string> = {
    Sunday: "0",
    Monday: "1",
    Tuesday: "2",
    Wednesday: "3",
    Thursday: "4",
    Friday: "5",
    Saturday: "6",
  };

  if (type === "daily") {
    try {
      await qstashClient.schedules.create({
        destination: `${BASE_URL}/api/reminder`,
        // body: {},
        body: `{\"pushToken\":\"${pushtoken}\",\"title\":\"${name}\",\"body\":\"${description}\"}`,
        cron: `${utcMinute} ${utcHour} * * *`,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  } else if (type === "weekly") {
    const firstDay = new Date().getDay();
    const dayOfWeek = dayMap[firstDay];
    try {
      await qstashClient.schedules.create({
        destination: `${BASE_URL}/api/reminder`,
        body: `{\"pushToken\":\"${pushtoken}\",\"title\":\"${name}\",\"body\":\"${description}\"}`,
        cron: `${utcMinute} ${utcHour} * * ${dayOfWeek}`,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  } else if (type === "custom" && targetDays) {
    try {
      await Promise.all(
        targetDays.map(async (day) => {
          const dayOfWeek = dayMap[day];
          if (!dayOfWeek) return;

          await qstashClient.schedules.create({
            destination: `${BASE_URL}/api/reminder`,
            body: `{\"pushToken\":\"${pushtoken}\",\"title\":\"${name}\",\"body\":\"${description}\"}`,
            cron: `${utcMinute} ${utcHour} * * ${dayOfWeek}`,
          });
        })
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
