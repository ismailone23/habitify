ALTER TABLE "habit_option" RENAME COLUMN "max_streaks" TO "count";--> statement-breakpoint
ALTER TABLE "habit_option" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "habit_option" ALTER COLUMN "created_at" SET DEFAULT now();