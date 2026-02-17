import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { database } from '@/db/database';
import { env } from '@/env';
import { accounts, sessions, users, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';

type SupportedSocialProvider = 'github' | 'google' | 'discord';

const socialProviders = {
  ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
  ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET
    ? {
        discord: {
          clientId: env.DISCORD_CLIENT_ID,
          clientSecret: env.DISCORD_CLIENT_SECRET,
        },
      }
    : {}),
};

export const enabledSocialProviders = new Set<SupportedSocialProvider>(
  Object.keys(socialProviders) as SupportedSocialProvider[]
);

export const authServer = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(database, {
    provider: 'pg',
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verification: verificationTokens,
    },
  }),
  socialProviders,
  plugins: [nextCookies()],
});

export const auth = async () => {
  return authServer.api.getSession({
    headers: await headers(),
  });
};

export const signIn = async (
  provider?: SupportedSocialProvider,
  options?: { redirectTo?: string }
): Promise<void> => {
  const requestHeaders = await headers();
  const callbackURL = options?.redirectTo ?? requestHeaders.get('x-fullPath') ?? '/';

  if (!provider) {
    redirect(callbackURL);
  }

  const response = await authServer.api.signInSocial({
    body: {
      provider,
      callbackURL,
    },
    headers: requestHeaders,
  });

  if (!response?.url) {
    throw new Error('Failed to start social sign-in.');
  }

  redirect(response.url);
};

export const signOut = async (): Promise<void> => {
  await authServer.api.signOut({
    headers: await headers(),
  });
};

export const isCurrentUserAdmin: () => Promise<boolean> = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return false;
  }

  const useIsAdmin = await isUserAdmin(userId);

  return useIsAdmin;
};

export const isUserAdmin: (userId: string) => Promise<boolean> = async (
  userId
) => {
  const userRoles = await database.query.user_roles.findMany({
    where: (user_roles) => eq(user_roles.userId, userId),
    with: {
      user: true,
      role: true,
    },
  });

  return userRoles.some((role) => role.role!.name === 'admin');
};
