import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { database } from '@/db/database';
import { users, accounts, sessions, verificationTokens } from '@/db/schema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Discord,
    Google,
    // Google({
    //   profile(profile) {
    //     return { role: profile.role ?? 'user' };
    //   },
    // }),
  ],
  adapter: DrizzleAdapter(database, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
});
