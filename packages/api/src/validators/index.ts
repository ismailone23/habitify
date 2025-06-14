import { z } from "zod";

export const FrequencyTypeEnum = z.enum(["daily", "weekly", "custom"]);
export type FrequencyType = z.infer<typeof FrequencyTypeEnum>;

export const DaysOfWeekEnum = z.enum([
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
]);
export type DaysOfweek = z.infer<typeof DaysOfWeekEnum>;

export const FrequencyConfigSchema = z.object({
  type: FrequencyTypeEnum,
  targetDays: z.array(DaysOfWeekEnum).nullable(),
  targetCount: z.number().int().positive(),
  time: z.string().nonempty(),
});

export type FrequencyConfig = z.infer<typeof FrequencyConfigSchema>;

export const HabitSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().nullable().optional(),
  userId: z.string(),
  name: z.string().nonempty("Name is required").max(100),
  description: z.string().max(300).nullable(),
  frequency: FrequencyConfigSchema,
  startDate: z.date(),
  endDate: z.date().nullable(),
  color: z
    .string()
    .nonempty("Color is required")
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Color must be a valid hex code",
    }),
  icon: z.string().nonempty("Icon is required"),
  status: z.enum(["active", "paused", "archived"]),
  timezone: z.string(),
});
export type Habit = z.infer<typeof HabitSchema>;

export const CreateHabitInputSchema = HabitSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});
export type CreateHabitInput = z.infer<typeof CreateHabitInputSchema>;

export const UpdateHabitInputSchema = CreateHabitInputSchema.partial();
export type UpdateHabitInput = z.infer<typeof UpdateHabitInputSchema>;
