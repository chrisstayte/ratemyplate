DO $$
BEGIN
  IF to_regclass('public.rmp_user') IS NOT NULL THEN
    ALTER TABLE "rmp_user" RENAME TO "rmp_auth_users";
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.rmp_account') IS NOT NULL THEN
    ALTER TABLE "rmp_account" RENAME TO "rmp_auth_accounts";
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.rmp_session') IS NOT NULL THEN
    ALTER TABLE "rmp_session" RENAME TO "rmp_auth_sessions";
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.rmp_verificationToken') IS NOT NULL THEN
    ALTER TABLE "rmp_verificationToken" RENAME TO "rmp_auth_verifications";
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.rmp_authenticator') IS NOT NULL THEN
    ALTER TABLE "rmp_authenticator" RENAME TO "rmp_auth_passkeys";
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.rmp_auth_users') IS NULL THEN
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_users'
      AND column_name = 'created_at'
  ) THEN
    ALTER TABLE "rmp_auth_users" RENAME COLUMN "created_at" TO "createdAt";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_users'
      AND column_name = 'emailVerified'
      AND udt_name IN ('timestamp', 'timestamptz')
  ) THEN
    ALTER TABLE "rmp_auth_users" RENAME COLUMN "emailVerified" TO "emailVerifiedAt";
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_users'
      AND column_name = 'emailVerified'
  ) THEN
    ALTER TABLE "rmp_auth_users" ADD COLUMN "emailVerified" boolean;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_users'
      AND column_name = 'emailVerifiedAt'
  ) THEN
    UPDATE "rmp_auth_users"
    SET "emailVerified" = ("emailVerifiedAt" IS NOT NULL)
    WHERE "emailVerified" IS NULL;

    ALTER TABLE "rmp_auth_users" DROP COLUMN "emailVerifiedAt";
  END IF;

  UPDATE "rmp_auth_users"
  SET "emailVerified" = false
  WHERE "emailVerified" IS NULL;

  ALTER TABLE "rmp_auth_users"
    ALTER COLUMN "emailVerified" SET DEFAULT false,
    ALTER COLUMN "emailVerified" SET NOT NULL;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_users'
      AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE "rmp_auth_users"
      ADD COLUMN "createdAt" timestamp with time zone NOT NULL DEFAULT now();
  ELSE
    UPDATE "rmp_auth_users"
    SET "createdAt" = now()
    WHERE "createdAt" IS NULL;

    ALTER TABLE "rmp_auth_users"
      ALTER COLUMN "createdAt" SET DEFAULT now(),
      ALTER COLUMN "createdAt" SET NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_users'
      AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE "rmp_auth_users" ADD COLUMN "updatedAt" timestamp with time zone;
  END IF;

  UPDATE "rmp_auth_users"
  SET "updatedAt" = COALESCE("updatedAt", "createdAt", now());

  ALTER TABLE "rmp_auth_users"
    ALTER COLUMN "updatedAt" SET DEFAULT now(),
    ALTER COLUMN "updatedAt" SET NOT NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.rmp_auth_accounts') IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'id'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "id" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'accountId'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "accountId" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'providerId'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "providerId" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'accessToken'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "accessToken" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'refreshToken'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "refreshToken" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'accessTokenExpiresAt'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "accessTokenExpiresAt" timestamp with time zone;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'refreshTokenExpiresAt'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "refreshTokenExpiresAt" timestamp with time zone;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'idToken'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "idToken" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'password'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "password" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "createdAt" timestamp with time zone;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE "rmp_auth_accounts" ADD COLUMN "updatedAt" timestamp with time zone;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'providerAccountId'
  ) THEN
    UPDATE "rmp_auth_accounts"
    SET "accountId" = COALESCE("accountId", "providerAccountId");
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'provider'
  ) THEN
    UPDATE "rmp_auth_accounts"
    SET "providerId" = COALESCE("providerId", "provider");
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'access_token'
  ) THEN
    UPDATE "rmp_auth_accounts"
    SET "accessToken" = COALESCE("accessToken", "access_token");
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'refresh_token'
  ) THEN
    UPDATE "rmp_auth_accounts"
    SET "refreshToken" = COALESCE("refreshToken", "refresh_token");
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'id_token'
  ) THEN
    UPDATE "rmp_auth_accounts"
    SET "idToken" = COALESCE("idToken", "id_token");
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_accounts'
      AND column_name = 'expires_at'
  ) THEN
    UPDATE "rmp_auth_accounts"
    SET "accessTokenExpiresAt" = COALESCE(
      "accessTokenExpiresAt",
      CASE
        WHEN "expires_at" IS NULL THEN NULL
        ELSE to_timestamp("expires_at")
      END
    );
  END IF;

  UPDATE "rmp_auth_accounts"
  SET
    "createdAt" = COALESCE("createdAt", now()),
    "updatedAt" = COALESCE("updatedAt", "createdAt", now()),
    "id" = COALESCE("id", md5(COALESCE("providerId", '') || ':' || COALESCE("accountId", '') || ':' || COALESCE("userId", '')));

  ALTER TABLE "rmp_auth_accounts" DROP CONSTRAINT IF EXISTS "rmp_account_provider_providerAccountId_pk";
  ALTER TABLE "rmp_auth_accounts" DROP CONSTRAINT IF EXISTS "rmp_auth_accounts_provider_providerAccountId_pk";
  ALTER TABLE "rmp_auth_accounts" DROP CONSTRAINT IF EXISTS "rmp_auth_accounts_pkey";
  ALTER TABLE "rmp_auth_accounts" ADD CONSTRAINT "rmp_auth_accounts_pkey" PRIMARY KEY ("id");

  ALTER TABLE "rmp_auth_accounts"
    ALTER COLUMN "id" SET NOT NULL,
    ALTER COLUMN "accountId" SET NOT NULL,
    ALTER COLUMN "providerId" SET NOT NULL,
    ALTER COLUMN "createdAt" SET NOT NULL,
    ALTER COLUMN "createdAt" SET DEFAULT now(),
    ALTER COLUMN "updatedAt" SET NOT NULL,
    ALTER COLUMN "updatedAt" SET DEFAULT now();

  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'rmp_auth_accounts_providerId_accountId_idx'
  ) THEN
    CREATE UNIQUE INDEX "rmp_auth_accounts_providerId_accountId_idx"
      ON "rmp_auth_accounts" ("providerId", "accountId");
  END IF;

  ALTER TABLE "rmp_auth_accounts" DROP COLUMN IF EXISTS "type";
  ALTER TABLE "rmp_auth_accounts" DROP COLUMN IF EXISTS "provider";
  ALTER TABLE "rmp_auth_accounts" DROP COLUMN IF EXISTS "providerAccountId";
  ALTER TABLE "rmp_auth_accounts" DROP COLUMN IF EXISTS "refresh_token";
  ALTER TABLE "rmp_auth_accounts" DROP COLUMN IF EXISTS "access_token";
  ALTER TABLE "rmp_auth_accounts" DROP COLUMN IF EXISTS "expires_at";
  ALTER TABLE "rmp_auth_accounts" DROP COLUMN IF EXISTS "token_type";
  ALTER TABLE "rmp_auth_accounts" DROP COLUMN IF EXISTS "id_token";
  ALTER TABLE "rmp_auth_accounts" DROP COLUMN IF EXISTS "session_state";
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.rmp_auth_sessions') IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_sessions'
      AND column_name = 'id'
  ) THEN
    ALTER TABLE "rmp_auth_sessions" ADD COLUMN "id" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_sessions'
      AND column_name = 'token'
  ) THEN
    ALTER TABLE "rmp_auth_sessions" ADD COLUMN "token" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_sessions'
      AND column_name = 'expiresAt'
  ) THEN
    ALTER TABLE "rmp_auth_sessions" ADD COLUMN "expiresAt" timestamp with time zone;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_sessions'
      AND column_name = 'ipAddress'
  ) THEN
    ALTER TABLE "rmp_auth_sessions" ADD COLUMN "ipAddress" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_sessions'
      AND column_name = 'userAgent'
  ) THEN
    ALTER TABLE "rmp_auth_sessions" ADD COLUMN "userAgent" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_sessions'
      AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE "rmp_auth_sessions" ADD COLUMN "createdAt" timestamp with time zone;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_sessions'
      AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE "rmp_auth_sessions" ADD COLUMN "updatedAt" timestamp with time zone;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_sessions'
      AND column_name = 'sessionToken'
  ) THEN
    UPDATE "rmp_auth_sessions"
    SET "token" = COALESCE("token", "sessionToken");
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_sessions'
      AND column_name = 'expires'
  ) THEN
    UPDATE "rmp_auth_sessions"
    SET "expiresAt" = COALESCE("expiresAt", "expires"::timestamp with time zone);
  END IF;

  UPDATE "rmp_auth_sessions"
  SET
    "createdAt" = COALESCE("createdAt", now()),
    "updatedAt" = COALESCE("updatedAt", "createdAt", now()),
    "id" = COALESCE("id", md5(COALESCE("token", '') || ':' || COALESCE("userId", '')));

  ALTER TABLE "rmp_auth_sessions" DROP CONSTRAINT IF EXISTS "rmp_session_pkey";
  ALTER TABLE "rmp_auth_sessions" DROP CONSTRAINT IF EXISTS "rmp_auth_sessions_pkey";
  ALTER TABLE "rmp_auth_sessions" ADD CONSTRAINT "rmp_auth_sessions_pkey" PRIMARY KEY ("id");

  ALTER TABLE "rmp_auth_sessions"
    ALTER COLUMN "id" SET NOT NULL,
    ALTER COLUMN "token" SET NOT NULL,
    ALTER COLUMN "expiresAt" SET NOT NULL,
    ALTER COLUMN "createdAt" SET NOT NULL,
    ALTER COLUMN "createdAt" SET DEFAULT now(),
    ALTER COLUMN "updatedAt" SET NOT NULL,
    ALTER COLUMN "updatedAt" SET DEFAULT now();

  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'rmp_auth_sessions_token_idx'
  ) THEN
    CREATE UNIQUE INDEX "rmp_auth_sessions_token_idx"
      ON "rmp_auth_sessions" ("token");
  END IF;

  ALTER TABLE "rmp_auth_sessions" DROP COLUMN IF EXISTS "sessionToken";
  ALTER TABLE "rmp_auth_sessions" DROP COLUMN IF EXISTS "expires";
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.rmp_auth_verifications') IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_verifications'
      AND column_name = 'id'
  ) THEN
    ALTER TABLE "rmp_auth_verifications" ADD COLUMN "id" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_verifications'
      AND column_name = 'value'
  ) THEN
    ALTER TABLE "rmp_auth_verifications" ADD COLUMN "value" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_verifications'
      AND column_name = 'expiresAt'
  ) THEN
    ALTER TABLE "rmp_auth_verifications" ADD COLUMN "expiresAt" timestamp with time zone;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_verifications'
      AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE "rmp_auth_verifications" ADD COLUMN "createdAt" timestamp with time zone;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_verifications'
      AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE "rmp_auth_verifications" ADD COLUMN "updatedAt" timestamp with time zone;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_verifications'
      AND column_name = 'token'
  ) THEN
    UPDATE "rmp_auth_verifications"
    SET "value" = COALESCE("value", "token");
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_verifications'
      AND column_name = 'expires'
  ) THEN
    UPDATE "rmp_auth_verifications"
    SET "expiresAt" = COALESCE("expiresAt", "expires"::timestamp with time zone);
  END IF;

  UPDATE "rmp_auth_verifications"
  SET
    "createdAt" = COALESCE("createdAt", now()),
    "updatedAt" = COALESCE("updatedAt", "createdAt", now()),
    "id" = COALESCE("id", md5(COALESCE("identifier", '') || ':' || COALESCE("value", '')));

  ALTER TABLE "rmp_auth_verifications" DROP CONSTRAINT IF EXISTS "rmp_verificationToken_identifier_token_pk";
  ALTER TABLE "rmp_auth_verifications" DROP CONSTRAINT IF EXISTS "rmp_auth_verifications_identifier_token_pk";
  ALTER TABLE "rmp_auth_verifications" DROP CONSTRAINT IF EXISTS "rmp_auth_verifications_pkey";
  ALTER TABLE "rmp_auth_verifications" ADD CONSTRAINT "rmp_auth_verifications_pkey" PRIMARY KEY ("id");

  ALTER TABLE "rmp_auth_verifications"
    ALTER COLUMN "id" SET NOT NULL,
    ALTER COLUMN "value" SET NOT NULL,
    ALTER COLUMN "expiresAt" SET NOT NULL,
    ALTER COLUMN "createdAt" SET NOT NULL,
    ALTER COLUMN "createdAt" SET DEFAULT now(),
    ALTER COLUMN "updatedAt" SET NOT NULL,
    ALTER COLUMN "updatedAt" SET DEFAULT now();

  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'rmp_auth_verifications_identifier_value_idx'
  ) THEN
    CREATE UNIQUE INDEX "rmp_auth_verifications_identifier_value_idx"
      ON "rmp_auth_verifications" ("identifier", "value");
  END IF;

  ALTER TABLE "rmp_auth_verifications" DROP COLUMN IF EXISTS "token";
  ALTER TABLE "rmp_auth_verifications" DROP COLUMN IF EXISTS "expires";
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.rmp_auth_passkeys') IS NULL THEN
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_passkeys'
      AND column_name = 'credentialID'
  ) THEN
    ALTER TABLE "rmp_auth_passkeys" RENAME COLUMN "credentialID" TO "credentialId";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_passkeys'
      AND column_name = 'providerAccountId'
  ) THEN
    ALTER TABLE "rmp_auth_passkeys" RENAME COLUMN "providerAccountId" TO "providerUserId";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_passkeys'
      AND column_name = 'credentialPublicKey'
  ) THEN
    ALTER TABLE "rmp_auth_passkeys" RENAME COLUMN "credentialPublicKey" TO "publicKey";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_passkeys'
      AND column_name = 'credentialDeviceType'
  ) THEN
    ALTER TABLE "rmp_auth_passkeys" RENAME COLUMN "credentialDeviceType" TO "deviceType";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rmp_auth_passkeys'
      AND column_name = 'credentialBackedUp'
  ) THEN
    ALTER TABLE "rmp_auth_passkeys" RENAME COLUMN "credentialBackedUp" TO "backedUp";
  END IF;

  ALTER TABLE "rmp_auth_passkeys" DROP CONSTRAINT IF EXISTS "rmp_authenticator_userId_credentialID_pk";
  ALTER TABLE "rmp_auth_passkeys" DROP CONSTRAINT IF EXISTS "rmp_auth_passkeys_userId_credentialID_pk";
  ALTER TABLE "rmp_auth_passkeys" DROP CONSTRAINT IF EXISTS "rmp_auth_passkeys_userId_credentialId_pk";
  ALTER TABLE "rmp_auth_passkeys"
    ADD CONSTRAINT "rmp_auth_passkeys_userId_credentialId_pk"
    PRIMARY KEY ("userId", "credentialId");
END $$;
