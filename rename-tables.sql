-- Migration: Rename tables and remove passkeys
-- Run this SQL directly against your database before deploying the updated schema.
--
-- This script:
--   1. Drops the rmp_auth_passkeys table (not a required Better Auth table)
--   2. Renames auth tables to Better Auth standard names (user, account, session, verification)
--   3. Renames business tables to remove the rmp_ prefix
--   4. Renames indexes to match new table names
--   5. Fixes user table to match Better Auth core schema (name NOT NULL, email UNIQUE)

BEGIN;

-- 1. Drop the passkeys table
DROP TABLE IF EXISTS "rmp_auth_passkeys";

-- 2. Rename auth tables to Better Auth defaults
ALTER TABLE "rmp_auth_users" RENAME TO "user";
ALTER TABLE "rmp_auth_accounts" RENAME TO "account";
ALTER TABLE "rmp_auth_sessions" RENAME TO "session";
ALTER TABLE "rmp_auth_verifications" RENAME TO "verification";

-- 3. Rename business tables (remove rmp_ prefix)
ALTER TABLE "rmp_plates" RENAME TO "plates";
ALTER TABLE "rmp_comments" RENAME TO "comments";
ALTER TABLE "rmp_roles" RENAME TO "roles";
ALTER TABLE "rmp_user_roles" RENAME TO "user_roles";
ALTER TABLE "rmp_user_favorite_plates" RENAME TO "user_favorite_plates";

-- 4. Rename indexes to match new table names
ALTER INDEX IF EXISTS "rmp_auth_accounts_providerId_accountId_idx" RENAME TO "account_providerId_accountId_idx";
ALTER INDEX IF EXISTS "rmp_auth_verifications_identifier_value_idx" RENAME TO "verification_identifier_value_idx";

-- The session token unique index may have been created under either name
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'rmp_auth_sessions_token_idx') THEN
    ALTER INDEX "rmp_auth_sessions_token_idx" RENAME TO "session_token_unique";
  ELSIF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'rmp_auth_sessions_token_unique') THEN
    ALTER INDEX "rmp_auth_sessions_token_unique" RENAME TO "session_token_unique";
  END IF;
END $$;

-- 5. Fix user table to match Better Auth core schema exactly
-- name must be NOT NULL (Better Auth: required: true)
UPDATE "user" SET "name" = split_part("email", '@', 1) WHERE "name" IS NULL;
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;

-- email must be UNIQUE (Better Auth: unique: true)
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE ("email");

COMMIT;
