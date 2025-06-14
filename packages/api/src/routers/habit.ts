import { HabitOptions, habitOptions, Habits, habits } from "@repo/db/schema";
import { protectedProcedure, router } from "../trpc";
import { CreateHabitInputSchema, UpdateHabitInputSchema } from "../validators";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { scheduleReminder } from "../scheduler";
import { HabitDataType } from "../types";

dayjs.extend(utc);
dayjs.extend(timezone);

export const habitRouter = router({
  createHabit: protectedProcedure
    .input(CreateHabitInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const [newHabit] = await ctx.db
        .insert(habits)
        .values({
          ...input,
          frequency: {
            time: input.frequency.time,
            targetCount: input.frequency.targetCount,
            type: input.frequency.type,
            targetDays: input.frequency.targetDays ?? null,
          },
          userId,
        })
        .returning();
      if (!newHabit) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error. Failed to Create Habit.",
        });
      }
      // if (ctx.user.expoPushToken) {
      //   try {
      //     await scheduleReminder({
      //       ...input.frequency,
      //       timezone: input.timezone,
      //       pushtoken: ctx.user.expoPushToken,
      //       description: input.description,
      //       name: input.name,
      //     });
      //     console.log("scheduled");
      //   } catch (error: any) {
      //     console.log(error);
      //     throw new TRPCError({
      //       code: "INTERNAL_SERVER_ERROR",
      //       message: `${error}. scheduling`,
      //     });
      //   }
      // }
      return newHabit;
    }),
  updateHabit: protectedProcedure
    .input(z.object({ habit: UpdateHabitInputSchema, hid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [update] = await ctx.db
        .update(habits)
        .set(input.habit)
        .where(and(eq(habits.userId, ctx.user.id), eq(habits.id, input.hid)))
        .returning();
      if (!update) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Internal Server Error. Failed to Fetch.",
        });
      }
      return update;
    }),
  updateStatus: protectedProcedure
    .input(
      z.object({
        status: z.enum(["active", "paused", "archived"]),
        hid: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [update] = await ctx.db
        .update(habits)
        .set({ status: input.status })
        .where(and(eq(habits.userId, ctx.user.id), eq(habits.id, input.hid)))
        .returning();
      if (!update) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Internal Server Error. Failed to Fetch.",
        });
      }
      return update;
    }),
  getAllHabits: protectedProcedure
    .input(
      z.object({
        status: z.enum(["active", "paused", "archived"]).default("active"),
      })
    )
    .query(async ({ ctx, input: { status } }) => {
      try {
        const returnHabit: HabitDataType[] = [];
        const usersHabit = await ctx.db
          .select()
          .from(habits)
          .where(and(eq(habits.userId, ctx.user.id), eq(habits.status, status)))
          .orderBy(desc(habits.createdAt));

        for (const habit of usersHabit) {
          const options = await ctx.db
            .select()
            .from(habitOptions)
            .where(eq(habitOptions.habitId, habit.id))
            .orderBy(desc(habitOptions.createdAt));
          returnHabit.push({ habit, options });
        }
        return returnHabit;
      } catch (error) {
        console.error("❌ getAllHabits failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch habits",
        });
      }
    }),
  getHabit: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [habit] = await ctx.db
        .select()
        .from(habits)
        .where(
          and(
            eq(habits.userId, ctx.session.id),
            eq(habits.id, input.id),
            eq(habits.status, "active")
          )
        );
      if (!habit) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Internal Server Error. Failed to Fetch.",
        });
      }
      const options = await ctx.db
        .select()
        .from(habitOptions)
        .where(eq(habitOptions.habitId, habit.id));
      return { habit, options };
    }),
  optionCount: protectedProcedure
    .input(
      z.object({
        hId: z.string().min(1, "Habit ID is required"),
        date: z.date().max(new Date(), "Date cannot be in the future"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const [habit] = await ctx.db
          .select()
          .from(habits)
          .where(
            and(
              eq(habits.userId, ctx.session.id),
              eq(habits.id, input.hId),
              eq(habits.status, "active")
            )
          );

        if (!habit) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Habit not found or inactive",
          });
        }

        const timezone = habit.timezone || "UTC";
        const inputDay = dayjs(input.date).tz(timezone).startOf("day");

        const startOfDay = inputDay.toDate();
        const endOfDay = inputDay.endOf("day").toDate();

        const [option] = await ctx.db
          .select()
          .from(habitOptions)
          .where(
            and(
              eq(habitOptions.habitId, habit.id),
              gte(habitOptions.createdAt, startOfDay),
              lte(habitOptions.createdAt, endOfDay)
            )
          );

        if (option) {
          const newCount =
            option.count < habit.frequency.targetCount ? option.count + 1 : 0;

          const [updated] = await ctx.db
            .update(habitOptions)
            .set({
              count: newCount,
            })
            .where(eq(habitOptions.id, option.id))
            .returning();
          return updated;
        }

        const [newOption] = await ctx.db
          .insert(habitOptions)
          .values({
            count: 1,
            habitId: habit.id,
            createdAt: input.date,
          })
          .returning();

        return newOption;
      } catch (error) {
        console.error("Option count error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update habit option",
        });
      }
    }),
  deleteHabit: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(habits)
        .where(and(eq(habits.id, input.id), eq(habits.userId, ctx.user.id)))
        .returning();
      if (!deleted) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete habit option",
        });
      }
      return deleted;
    }),
});
