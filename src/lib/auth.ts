import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { database } from '@/db/database';
import { env } from '@/env';
import * as authSchema from '@/db/auth-schema';

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: 'pg',
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: false, // We only use OAuth
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL || 'http://localhost:3000',
});

// Helper function to check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const userRoles = await database.query.user_roles.findMany({
    where: (user_roles, { eq }) => eq(user_roles.userId, userId),
    with: {
      role: true,
    },
  });

  return userRoles.some((ur) => ur.role?.name === 'admin');
};

// Helper function to get current user session
export const getCurrentUser = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then((mod) => mod.headers()),
    });
    return session;
  } catch (error) {
    return null;
  }
};

// Helper function to check if current user is admin
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  const session = await getCurrentUser();
  if (!session || !session.user) {
    return false;
  }
  return isUserAdmin(session.user.id);
};
