import { User } from "@repo/db/schema";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export interface Payload {
  id: string;
  name: string | null;
}

export const getSession = (req: NextRequest): Payload | null => {
  const accessToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!accessToken) {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET!);
    return payload as Payload;
  } catch (error) {
    return null;
  }
};

export const signJwt = (user: User) => {
  const payload: Payload = {
    id: user.id,
    name: user.name,
  };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  return token;
};
