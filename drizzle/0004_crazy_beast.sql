ALTER TABLE "rmp_comments" ALTER COLUMN "comment" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rmp_comments" ALTER COLUMN "timestamp" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rmp_plates" ALTER COLUMN "timestamp" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rmp_user" ALTER COLUMN "created_at" SET NOT NULL;