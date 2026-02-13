# Better Auth Migration Guide

This document describes the migration from NextAuth v5 to Better Auth.

## Overview

The application has been migrated from NextAuth v5 (beta) to Better Auth, a modern authentication library with full TypeScript support and improved developer experience.

## What Changed

### Dependencies
- **Removed**: `next-auth@5.0.0-beta.19`, `@auth/drizzle-adapter`
- **Added**: `better-auth@1.4.18`
- **Updated**: `drizzle-kit` and `drizzle-orm` to latest versions

### Authentication Configuration
- Old: `/src/auth.ts` (NextAuth config)
- New: `/src/lib/auth.ts` (Better Auth config)
- API Route: Changed from `/api/auth/[...nextauth]` to `/api/auth/[...all]`

### Database Schema
The migration preserves your existing data with minimal schema changes:

1. **User Table** (`rmp_user`):
   - Added `emailVerified` as boolean (converted from timestamp)
   - Added `updated_at` timestamp

2. **Session Table** (`rmp_session`):
   - Added `id`, `token`, `expiresAt`, `createdAt`, `updatedAt`, `ipAddress`, `userAgent`
   - Old columns preserved for compatibility

3. **Account Table** (`rmp_account`):
   - Added Better Auth field mappings
   - Old columns preserved for compatibility

4. **Verification Table**: New table `rmp_verification` for email verification

### Code Changes

#### Server Components & Actions
All server-side authentication calls changed:
```typescript
// Old (NextAuth)
import { auth } from '@/auth';
const session = await auth();

// New (Better Auth)
import { getCurrentUser } from '@/lib/auth';
const session = await getCurrentUser();
```

#### Client Components
All client-side authentication changed:
```typescript
// Old (NextAuth)
import { signIn, signOut } from 'next-auth/react';

// New (Better Auth)
import { authClient, useSession } from '@/lib/auth-client';
```

## Migration Steps for Existing Deployments

### 1. Update Environment Variables

Update your `.env` file with the new required variables:

```bash
# Remove old NextAuth variables (keep for now during transition):
# AUTH_SECRET (keep temporarily)

# Add new Better Auth variables:
BETTER_AUTH_SECRET=<generate with: npx @better-auth/cli secret>
BETTER_AUTH_URL=https://yourdomain.com  # or http://localhost:3000 for dev

# OAuth credentials (rename from old format):
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
DISCORD_CLIENT_ID=<your-discord-client-id>
DISCORD_CLIENT_SECRET=<your-discord-client-secret>
```

**Note**: Old environment variable names from NextAuth:
- `AUTH_GITHUB_ID` → `GITHUB_CLIENT_ID`
- `AUTH_GITHUB_SECRET` → `GITHUB_CLIENT_SECRET`
- `AUTH_DISCORD_ID` → `DISCORD_CLIENT_ID`
- `AUTH_DISCORD_SECRET` → `DISCORD_CLIENT_SECRET`
- `AUTH_GOOGLE_ID` → `GOOGLE_CLIENT_ID`
- `AUTH_GOOGLE_SECRET` → `GOOGLE_CLIENT_SECRET`

### 2. Run Database Migration

Before deploying the new code, run the database migration:

```bash
# Install dependencies
npm install

# Run the migration script
npm run db:migrate-auth
```

Or manually with:
```bash
npx tsx src/db/migrate-auth.ts
```

This script will:
- Add new columns to existing tables
- Convert `emailVerified` from timestamp to boolean
- Create new verification table
- Preserve all existing user data and sessions

### 3. Update OAuth Callback URLs

Update your OAuth provider settings with the new callback URL pattern:

**Old URLs**:
- `https://yourdomain.com/api/auth/callback/github`
- `https://yourdomain.com/api/auth/callback/google`
- `https://yourdomain.com/api/auth/callback/discord`

**New URLs** (same pattern, different handler):
- `https://yourdomain.com/api/auth/callback/github`
- `https://yourdomain.com/api/auth/callback/google`
- `https://yourdomain.com/api/auth/callback/discord`

The URLs remain the same, but they're now handled by Better Auth.

### 4. Deploy the New Code

```bash
npm install
npm run build
npm start  # or your production command
```

### 5. Verify the Migration

1. **Test Login**: Try logging in with all three OAuth providers (GitHub, Google, Discord)
2. **Check Existing Sessions**: Verify that existing logged-in users remain authenticated
3. **Test Admin Access**: Verify admin users can access the dashboard
4. **Test Actions**: Verify authenticated actions work (creating plates, adding comments, favorites)

## Development Setup

For new development environments:

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Generate Better Auth secret
npx @better-auth/cli secret

# Push schema to database
npm run db:push

# Run development server
npm run dev
```

## Breaking Changes

### For Users
- **None**: Existing sessions and accounts continue to work
- Users may be prompted to re-authenticate once after migration

### For Developers
- All authentication imports must be updated from `@/auth` to `@/lib/auth`
- Client components must use `useSession` hook instead of server-side `auth()`
- Sign-in/sign-out now uses `authClient` methods

## Benefits of Better Auth

1. **Full TypeScript Support**: Better type safety and autocomplete
2. **Framework Agnostic**: Can be used outside Next.js if needed
3. **Modern API**: Cleaner and more intuitive API design
4. **Better DX**: Improved developer experience with better error messages
5. **Active Development**: Regular updates and community support
6. **Plugin System**: Extensible with plugins for 2FA, MFA, etc.

## Rollback Plan

If you need to rollback:

1. Keep the old environment variables
2. The database schema is backward compatible (old columns preserved)
3. Reinstall NextAuth dependencies:
   ```bash
   npm install next-auth@^5.0.0-beta.19 @auth/drizzle-adapter@^1.2.0
   ```
4. Restore the old `/src/auth.ts` file from git history
5. Revert code changes

## Troubleshooting

### "Session not found" errors
- Ensure `BETTER_AUTH_SECRET` is set correctly
- Check that `BETTER_AUTH_URL` matches your domain
- Verify OAuth callback URLs are configured correctly

### OAuth provider errors
- Double-check client IDs and secrets in environment variables
- Ensure callback URLs are updated in provider settings
- Verify environment variable names match the new format

### Database errors
- Run the migration script if you haven't already
- Check that database connection is working
- Verify the database user has sufficient permissions

## Support

For issues specific to Better Auth, see:
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)

For issues with this migration, please open an issue in the repository.
