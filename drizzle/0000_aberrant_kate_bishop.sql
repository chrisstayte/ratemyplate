CREATE TABLE IF NOT EXISTS "rmp_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "rmp_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rmp_authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "rmp_authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "rmp_authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rmp_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text,
	"plateId" integer,
	"comment" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rmp_plates" (
	"id" serial PRIMARY KEY NOT NULL,
	"plateNumber" text NOT NULL,
	"state" varchar(2) NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rmp_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rmp_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rmp_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "rmp_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rmp_account" ADD CONSTRAINT "rmp_account_userId_rmp_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."rmp_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rmp_authenticator" ADD CONSTRAINT "rmp_authenticator_userId_rmp_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."rmp_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rmp_comments" ADD CONSTRAINT "rmp_comments_userId_rmp_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."rmp_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rmp_comments" ADD CONSTRAINT "rmp_comments_plateId_rmp_plates_id_fk" FOREIGN KEY ("plateId") REFERENCES "public"."rmp_plates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rmp_plates" ADD CONSTRAINT "rmp_plates_userId_rmp_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."rmp_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rmp_session" ADD CONSTRAINT "rmp_session_userId_rmp_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."rmp_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
