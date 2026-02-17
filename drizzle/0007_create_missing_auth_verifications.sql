DO $$
BEGIN
  IF to_regclass('public.rmp_auth_verifications') IS NULL THEN
    CREATE TABLE "rmp_auth_verifications" (
      "id" text PRIMARY KEY NOT NULL,
      "identifier" text NOT NULL,
      "value" text NOT NULL,
      "expiresAt" timestamp with time zone NOT NULL,
      "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
      "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
    );
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'rmp_auth_verifications_identifier_value_idx'
  ) THEN
    CREATE UNIQUE INDEX "rmp_auth_verifications_identifier_value_idx"
      ON "rmp_auth_verifications" ("identifier", "value");
  END IF;
END $$;
