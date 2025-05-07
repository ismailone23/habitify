import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { HabitOptions, habitOptions, Habits, habits } from "@repo/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export type habitData = {
  habit: Habits;
  habitOptions: HabitOptions[];
};

export const habitRouter = router({
  getAllhabits: protectedProcedure.query(async ({ ctx }) => {
    const habit = await ctx.db
      .select()
      .from(habits)
      .where(eq(habits.authorId, ctx.session.id))
      .orderBy(desc(habits.createdAt));
    const data: habitData[] = [];

    for (let i = 0; i < habit.length; i++) {
      const chabit = habit[i];
      if (!chabit) return;
      const options = await ctx.db
        .select()
        .from(habitOptions)
        .where(eq(habitOptions.habitId, chabit.id));
      data.push({ habit: chabit, habitOptions: options });
    }

    return data;
  }),
  createHabit: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        color: z.string(),
        icon: z.string(),
        maxStraks: z.number().default(1).optional(),
        reminder: z.string().optional(),
      })
    )
    .mutation(
      async ({
        ctx,
        input: { color, description, icon, title, maxStraks, reminder },
      }) => {
        const [habit] = await ctx.db
          .insert(habits)
          .values({
            color,
            description,
            title,
            icon,
            authorId: ctx.session.id,
            maxStraks,
            reminder,
          })
          .returning();
        if (!habit)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create habit. Internal server error.",
          });
        return habit;
      }
    ),
  updateHabit: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
        maxStraks: z.number().default(1).optional(),
        reminder: z.string().optional(),
        habitId: z.string(),
        categoryId: z.string().optional(),
      })
    )
    .mutation(
      async ({
        ctx,
        input: {
          color,
          description,
          icon,
          title,
          maxStraks,
          reminder,
          categoryId,
          habitId,
        },
      }) => {
        const [isAuthor] = await ctx.db
          .select()
          .from(habits)
          .where(
            and(eq(habits.id, habitId), eq(habits.authorId, ctx.session.id))
          );
        if (!isAuthor)
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access do this action.",
          });
        const [habit] = await ctx.db
          .update(habits)
          .set({
            color,
            description,
            title,
            icon,
            categoryId,
            maxStraks,
            reminder,
          })
          .where(
            and(eq(habits.id, habitId), eq(habits.authorId, ctx.session.id))
          )
          .returning();
        if (!habit)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update habit. Internal server error.",
          });

        return habit;
      }
    ),
  createHabitOption: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        timestamp: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input: { habitId, timestamp } }) => {
      const [isAuthor] = await ctx.db
        .select()
        .from(habits)
        .where(
          and(eq(habits.id, habitId), eq(habits.authorId, ctx.session.id))
        );
      if (!isAuthor)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access do this action.",
        });
      const [habitOption] = await ctx.db
        .insert(habitOptions)
        .values({ habitId, timestamp })
        .returning();
      if (!habitOption)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error.",
        });
      return habitOption;
    }),
  updateHabitOption: protectedProcedure
    .input(
      z.object({
        currentStrak: z.number().default(0),
        habitId: z.string(),
        timestamp: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input: { currentStrak, habitId, timestamp } }) => {
      const [isAuthor] = await ctx.db
        .select()
        .from(habits)
        .where(
          and(eq(habits.id, habitId), eq(habits.authorId, ctx.session.id))
        );
      if (!isAuthor)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access do this action.",
        });
      const [habitOption] = await ctx.db
        .update(habitOptions)
        .set({ streak: currentStrak, timestamp })
        .where(eq(habitOptions.habitId, habitId))
        .returning();
      if (!habitOption)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error.",
        });
      return habitOption;
    }),
});
