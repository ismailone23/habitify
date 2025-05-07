ALTER TABLE "habit" ADD COLUMN "max_streaks" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "habit" ADD COLUMN "reminder" varchar;--> statement-breakpoint
ALTER TABLE "habit_option" DROP COLUMN "reminder";