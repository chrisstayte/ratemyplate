ALTER TABLE "rmp_user" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "rmp_user" DROP COLUMN IF EXISTS "role";