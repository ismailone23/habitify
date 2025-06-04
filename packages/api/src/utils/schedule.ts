import { qstashClient } from "../qstash";

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
  const [hour, minute] = reminderTime.split(":").map(Number);

  const timeInUTC = new Date(
    new Date()
      .toLocaleString("en-US", { timeZone: timezone })
      .replace(/(\d+):(\d+)/, `${hour}:${minute}`)
  ).toISOString();

  const utcHour = new Date(timeInUTC).getUTCHours();
  const utcMinute = new Date(timeInUTC).getUTCMinutes();

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
    await qstashClient.publishJSON({
      url: `${BASE_URL}/api/reminder`,
      body: baseBody,
      schedule: `cron(${utcMinute} ${utcHour} * * ? *)`,
    });
  } else if (reminderFrequency === "Weekly") {
    const firstDay = reminderDays[0] ?? "Monday";
    const dayOfWeek = dayMap[firstDay] ?? "1"; // Monday = 1
    await qstashClient.publishJSON({
      url: `${BASE_URL}/api/reminder`,
      body: baseBody,
      schedule: `cron(${utcMinute} ${utcHour} ? * ${dayOfWeek} *)`,
    });
  } else if (reminderFrequency === "Custom") {
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
  }
}
