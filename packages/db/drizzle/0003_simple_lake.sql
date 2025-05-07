ALTER TABLE "user" ALTER COLUMN "is_anonymous" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "habit_option" ALTER COLUMN "created_at" DROP NOT NULL;