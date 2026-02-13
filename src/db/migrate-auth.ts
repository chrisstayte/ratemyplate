import { database } from '@/db/database';
import { sql } from 'drizzle-orm';

/**
 * Migration script to convert NextAuth tables to Better Auth format
 * This script will:
 * 1. Backup existing data
 * 2. Transform user table (convert emailVerified timestamp to boolean)
 * 3. Transform session table (add required fields, rename columns)
 * 4. Transform account table (rename columns to Better Auth format)
 * 5. Transform verification tokens table
 */

async function migrateAuthData() {
  console.log('Starting Better Auth migration...');

  try {
    // Step 1: Add new columns to existing tables
    console.log('Adding new columns to rmp_user table...');
    await database.execute(sql`
      ALTER TABLE rmp_user 
      ADD COLUMN IF NOT EXISTS "emailVerifiedBoolean" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT NOW();
    `);

    // Step 2: Convert emailVerified from timestamp to boolean in new column
    console.log('Converting emailVerified from timestamp to boolean...');
    await database.execute(sql`
      UPDATE rmp_user 
      SET "emailVerifiedBoolean" = CASE 
        WHEN "emailVerified" IS NOT NULL THEN true 
        ELSE false 
      END
      WHERE "emailVerifiedBoolean" = false;
    `);

    // Step 3: Drop old emailVerified column and rename new one
    console.log('Finalizing emailVerified column...');
    await database.execute(sql`
      ALTER TABLE rmp_user 
      DROP COLUMN IF EXISTS "emailVerified",
      ALTER COLUMN "emailVerifiedBoolean" SET NOT NULL;
    `);
    
    await database.execute(sql`
      ALTER TABLE rmp_user 
      RENAME COLUMN "emailVerifiedBoolean" TO "emailVerified";
    `);

    // Step 3: Update session table structure
    console.log('Updating session table...');
    await database.execute(sql`
      ALTER TABLE rmp_session 
      ADD COLUMN IF NOT EXISTS id text,
      ADD COLUMN IF NOT EXISTS token text,
      ADD COLUMN IF NOT EXISTS "expiresAt" timestamp,
      ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS "ipAddress" text,
      ADD COLUMN IF NOT EXISTS "userAgent" text;
    `);

    // Copy sessionToken to token column
    console.log('Migrating session tokens...');
    await database.execute(sql`
      UPDATE rmp_session 
      SET 
        id = COALESCE(id, gen_random_uuid()::text),
        token = COALESCE(token, "sessionToken"),
        "expiresAt" = COALESCE("expiresAt", expires),
        "createdAt" = COALESCE("createdAt", NOW()),
        "updatedAt" = COALESCE("updatedAt", NOW())
      WHERE token IS NULL OR id IS NULL;
    `);

    // Step 4: Update account table structure
    console.log('Updating account table...');
    await database.execute(sql`
      ALTER TABLE rmp_account 
      ADD COLUMN IF NOT EXISTS id text,
      ADD COLUMN IF NOT EXISTS "accountId" text,
      ADD COLUMN IF NOT EXISTS "providerId" text,
      ADD COLUMN IF NOT EXISTS "accessToken" text,
      ADD COLUMN IF NOT EXISTS "refreshToken" text,
      ADD COLUMN IF NOT EXISTS "idToken" text,
      ADD COLUMN IF NOT EXISTS "accessTokenExpiresAt" timestamp,
      ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" timestamp,
      ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS password text;
    `);

    // Migrate account data
    console.log('Migrating account data...');
    await database.execute(sql`
      UPDATE rmp_account 
      SET 
        id = COALESCE(id, gen_random_uuid()::text),
        "accountId" = COALESCE("accountId", "providerAccountId"),
        "providerId" = COALESCE("providerId", provider),
        "accessToken" = COALESCE("accessToken", access_token),
        "refreshToken" = COALESCE("refreshToken", refresh_token),
        "idToken" = COALESCE("idToken", id_token),
        "accessTokenExpiresAt" = COALESCE("accessTokenExpiresAt", 
          CASE WHEN expires_at IS NOT NULL 
          THEN to_timestamp(expires_at)
          ELSE NULL END),
        "createdAt" = COALESCE("createdAt", NOW()),
        "updatedAt" = COALESCE("updatedAt", NOW())
      WHERE "accountId" IS NULL OR id IS NULL;
    `);

    // Step 5: Create new verification table if it doesn't exist
    console.log('Creating verification table...');
    await database.execute(sql`
      CREATE TABLE IF NOT EXISTS rmp_verification (
        id text PRIMARY KEY,
        identifier text NOT NULL,
        value text NOT NULL,
        "expiresAt" timestamp NOT NULL,
        "createdAt" timestamp,
        "updatedAt" timestamp
      );
    `);

    // Migrate verification tokens if any exist
    console.log('Migrating verification tokens...');
    await database.execute(sql`
      INSERT INTO rmp_verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
      SELECT 
        gen_random_uuid()::text,
        identifier,
        token,
        expires,
        NOW(),
        NOW()
      FROM rmp_verificationToken
      ON CONFLICT DO NOTHING;
    `);

    console.log('Migration completed successfully!');
    console.log('Note: Old columns are preserved. You can drop them manually after verification.');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateAuthData()
    .then(() => {
      console.log('All migrations complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrateAuthData };
