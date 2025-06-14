import { NextResponse } from "next/server";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

export async function POST(req: Request) {
  const body = await req.json();
  const { pushToken, title, body: msgBody } = body;

  if (!Expo.isExpoPushToken(pushToken)) {
    return NextResponse.json({ error: "Invalid push token" }, { status: 400 });
  }

  try {
    await expo.sendPushNotificationsAsync([
      {
        to: pushToken,
        sound: "default",
        title,
        body: msgBody,
      },
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
