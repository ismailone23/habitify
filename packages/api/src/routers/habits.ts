import { habitOptions, habits } from "@repo/db/schema";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";
import type { habitData } from "../types";
import { scheduleReminder } from "../utils/schedule";

export const habitRouter = router({
  getAllhabits: protectedProcedure
    .input(z.object({ isArchived: z.boolean().default(false) }))
    .query(async ({ ctx, input: { isArchived } }) => {
      const rows = await ctx.db
        .select({ habit: habits, option: habitOptions })
        .from(habits)
        .leftJoin(habitOptions, eq(habits.id, habitOptions.habitId))
        .where(
          and(
            eq(habits.authorId, ctx.session.id),
            eq(habits.isArchived, isArchived)
          )
        )
        .orderBy(desc(habits.createdAt));

      const habitMap = new Map<string, habitData>();

      for (const row of rows) {
        const habitId = row.habit.id;

        if (!habitMap.has(habitId)) {
          habitMap.set(habitId, {
            habit: row.habit,
            habitOptions: [],
            isCompletedToday: false,
          });
        }

        if (row.option) {
          const habitEntry = habitMap.get(habitId)!;
          habitEntry.habitOptions.push(row.option);

          if (dayjs(row.option.timestamp).isSame(new Date(), "day")) {
            habitEntry.isCompletedToday = true;
          }
        }
      }

      return Array.from(habitMap.values());
    }),

  getHabitWithId: protectedProcedure
    .input(z.object({ id: z.string().nullable() }))
    .query(async ({ ctx, input: { id } }) => {
      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Identity Not Found",
        });
      }

      const [habit] = await ctx.db
        .select()
        .from(habits)
        .where(
          and(
            eq(habits.id, id),
            eq(habits.authorId, ctx.session.id),
            eq(habits.isArchived, false)
          )
        );

      if (!habit) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "not found",
        });
      }

      const habitOption = await ctx.db
        .select()
        .from(habitOptions)
        .where(eq(habitOptions.habitId, id));

      const isCompletedToday = habitOption.some((op) =>
        dayjs(op.timestamp).isSame(new Date(), "day")
      );

      return {
        habit,
        habitOptions: habitOption,
        isCompletedToday,
      } satisfies habitData;
    }),

  createHabit: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        color: z.string(),
        icon: z.string(),
        maxStreaks: z.number().default(1),
        reminderEnabled: z.boolean(),
        reminderFrequency: z
          .enum(["Daily", "Weekly", "Custom", "None"])
          .default("None"),
        reminderTime: z.string(),
        reminderDays: z.array(z.string()),
        timezone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [habit] = await ctx.db
        .insert(habits)
        .values({ ...input, authorId: ctx.session.id })
        .returning();

      if (!habit) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create habit. Internal server error.",
        });
      }

      if (
        input.reminderEnabled &&
        input.reminderFrequency !== "None" &&
        ctx.user.expoPushToken
      ) {
        await scheduleReminder({
          reminderDays: input.reminderDays,
          reminderFrequency: input.reminderFrequency,
          reminderTime: input.reminderTime,
          timezone: input.timezone,
          title: input.title,
          body: `Did you Remember complete ${input.title} ?`,
          pushToken: ctx.user.expoPushToken,
        });
      }

      return habit;
    }),

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
    .mutation(async ({ ctx, input }) => {
      const [isAuthor] = await ctx.db
        .select()
        .from(habits)
        .where(
          and(eq(habits.id, input.habitId), eq(habits.authorId, ctx.session.id))
        );

      if (!isAuthor) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access do this action.",
        });
      }

      const [habit] = await ctx.db
        .update(habits)
        .set(input)
        .where(
          and(eq(habits.id, input.habitId), eq(habits.authorId, ctx.session.id))
        )
        .returning();

      if (!habit) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update habit. Internal server error.",
        });
      }

      return habit;
    }),
  createHabitOption: protectedProcedure
    .input(
      z.object({
        habitId: z.string().nullable(),
        timestamp: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input: { habitId, timestamp } }) => {
      if (!habitId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Identity Not Found",
        });
      }
      const date = timestamp ?? new Date();
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const [habit] = await ctx.db
        .select()
        .from(habits)
        .where(
          and(eq(habits.id, habitId), eq(habits.authorId, ctx.session.id))
        );

      if (!habit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to do this action.",
        });
      }

      const [existing] = await ctx.db
        .select()
        .from(habitOptions)
        .where(
          and(
            eq(habitOptions.habitId, habitId),
            sql`(${habitOptions.timestamp})::date = ${dateStr}`
          )
        );

      if (existing) {
        const deleted = await ctx.db
          .delete(habitOptions)
          .where(eq(habitOptions.id, existing.id))
          .returning()
          .then((rows) => rows[0]);

        if (!deleted) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update.",
          });
        }

        return deleted;
      }

      const [inserted] = await ctx.db
        .insert(habitOptions)
        .values({ habitId, timestamp })
        .returning();

      if (!inserted) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error.",
        });
      }

      return inserted;
    }),

  deleteHabit: protectedProcedure
    .input(
      z.object({
        habitId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input: { habitId } }) => {
      if (!habitId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Identity Not Found",
        });
      }
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
      const [deletedHabit] = await ctx.db
        .delete(habits)
        .where(eq(habits.id, habitId))
        .returning();

      const [deletedHabitOpt] = await ctx.db
        .delete(habitOptions)
        .where(eq(habitOptions.habitId, habitId))
        .returning();
      if (!deletedHabit || !deletedHabitOpt)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error.",
        });
      return { deletedHabit, deletedHabitOpt };
    }),

  archiveHabit: protectedProcedure
    .input(
      z.object({
        habitId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input: { habitId } }) => {
      if (!habitId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Identity Not Found",
        });
      }
      const [isExisting] = await ctx.db
        .select()
        .from(habits)
        .where(
          and(eq(habits.id, habitId), eq(habits.authorId, ctx.session.id))
        );
      if (!isExisting)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access do this action.",
        });
      console.log("on");

      const [archiveHabit] = await ctx.db
        .update(habits)
        .set({ isArchived: !isExisting.isArchived })
        .where(eq(habits.id, habitId))
        .returning();

      if (!archiveHabit)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error.",
        });
      return archiveHabit;
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
