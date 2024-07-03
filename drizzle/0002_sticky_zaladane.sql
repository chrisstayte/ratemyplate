CREATE TABLE IF NOT EXISTS "rmp_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rmp_user_roles" (
	"userId" text,
	"roleId" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rmp_user_roles" ADD CONSTRAINT "rmp_user_roles_userId_rmp_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."rmp_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rmp_user_roles" ADD CONSTRAINT "rmp_user_roles_roleId_rmp_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."rmp_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
