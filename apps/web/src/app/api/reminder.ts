import { NextApiRequest, NextApiResponse } from "next";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { pushToken, title, body } = req.body;

  if (!Expo.isExpoPushToken(pushToken)) {
    return res.status(400).json({ error: "Invalid push token" });
  }

  try {
    await expo.sendPushNotificationsAsync([
      {
        to: pushToken,
        sound: "default",
        title,
        body,
      },
    ]);

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to send notification" });
  }
}
