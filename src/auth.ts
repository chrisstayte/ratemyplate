import NextAuth, { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { database } from '@/db/database';
import { users, accounts, sessions, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const authConfig = {
  providers: [GitHub, Discord, Google],
  adapter: DrizzleAdapter(database, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

export const isCurrentUserAdmin: () => Promise<boolean> = async () => {
  const session = await auth();
  if (!session) {
    return false;
  }

  const userId = session.user!.id!;

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
