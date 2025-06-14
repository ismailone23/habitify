import { signJwt } from "@repo/auth";
import { users } from "@repo/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  signInAnonymously: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.session) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are already signned in!",
      });
    }
    const [user] = await ctx.db
      .insert(users)
      .values({ isAnonymous: true })
      .returning();
    if (!user)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create user. Internal server error.",
      });
    const accessToken = signJwt(user);
    return { user, accessToken };
  }),
  currentUser: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.session.id));
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No user found.",
      });
    }
    return user;
  }),
  updateUser: protectedProcedure
    .input(z.object({ expoPushToken: z.string() }))
    .mutation(async ({ ctx, input: { expoPushToken } }) => {
      const [user] = await ctx.db
        .update(users)
        .set({ expoPushToken })
        .where(eq(users.id, ctx.user.id))
        .returning();
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No user found.",
        });
      }
      return user;
    }),
});
