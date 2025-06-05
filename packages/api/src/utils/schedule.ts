import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { qstashClient } from "../qstash";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ReminderPayload {
  title: string;
  body: string;
  pushToken: string;
}

const BASE_URL = "https://habitify-tawny.vercel.app";

export async function scheduleReminder({
  reminderFrequency,
  reminderTime,
  reminderDays,
  timezone,
  body,
  pushToken,
  title,
}: {
  reminderFrequency: "Daily" | "Weekly" | "Custom" | "None";
  reminderTime: string; // "09:00"
  reminderDays: string[]; // e.g., ["Monday", "Wednesday"]
  timezone: string; // e.g., "Europe/London"
  title: string;
  body: string;
  pushToken: string;
}) {
  const [hourStr, minuteStr] = reminderTime.split(":");

  // Validate first
  if (!hourStr || !minuteStr) {
    throw new Error(`Invalid reminderTime format: "${reminderTime}"`);
  }

  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (isNaN(hour) || isNaN(minute)) {
    throw new Error(`Invalid reminderTime value: "${reminderTime}"`);
  }

  const now = dayjs().tz(timezone);
  const scheduledTime = now.hour(hour).minute(minute).second(0);

  // Get UTC time components
  const utcHour = scheduledTime.utc().hour();
  const utcMinute = scheduledTime.utc().minute();

  const baseBody: ReminderPayload = { body, title, pushToken };

  const dayMap: Record<string, string> = {
    Sunday: "0",
    Monday: "1",
    Tuesday: "2",
    Wednesday: "3",
    Thursday: "4",
    Friday: "5",
    Saturday: "6",
  };

  if (reminderFrequency === "Daily") {
    try {
      await qstashClient.publishJSON({
        url: `${BASE_URL}/api/reminder`,
        body: baseBody,
        schedule: `cron(${utcMinute} ${utcHour} * * ? *)`,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  } else if (reminderFrequency === "Weekly") {
    const firstDay = reminderDays[0] ?? "Monday";
    const dayOfWeek = dayMap[firstDay] ?? "1"; // Monday = 1
    try {
      await qstashClient.publishJSON({
        url: `${BASE_URL}/api/reminder`,
        body: baseBody,
        schedule: `cron(${utcMinute} ${utcHour} ? * ${dayOfWeek} *)`,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  } else if (reminderFrequency === "Custom") {
    try {
      await Promise.all(
        reminderDays.map(async (day) => {
          const dayOfWeek = dayMap[day];
          if (!dayOfWeek) return;

          await qstashClient.publishJSON({
            url: `${BASE_URL}/api/reminder`,
            body: baseBody,
            schedule: `cron(${utcMinute} ${utcHour} ? * ${dayOfWeek} *)`,
          });
        })
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
