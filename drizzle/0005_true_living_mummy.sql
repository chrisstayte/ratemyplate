CREATE TABLE IF NOT EXISTS "rmp_user_favorite_plates" (
	"userId" text,
	"plateId" integer,
	CONSTRAINT "rmp_user_favorite_plates_userId_plateId_pk" PRIMARY KEY("userId","plateId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rmp_user_favorite_plates" ADD CONSTRAINT "rmp_user_favorite_plates_userId_rmp_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."rmp_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rmp_user_favorite_plates" ADD CONSTRAINT "rmp_user_favorite_plates_plateId_rmp_plates_id_fk" FOREIGN KEY ("plateId") REFERENCES "public"."rmp_plates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
