import { getSession } from "@repo/auth";
import { db } from "@repo/db";
import type { NextRequest } from "next/server";

export function createTRPCContext({ req }: { req: NextRequest }) {
  const session = getSession(req);
  return { req, db, session };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
