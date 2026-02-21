ALTER TABLE "passkeys" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "passkeys" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");