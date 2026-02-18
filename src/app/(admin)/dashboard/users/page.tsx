'use server';

import { auth, isUserAdmin } from '@/auth';
import NotAuthenticated from '@/components/dashboard/not-authenticated';

import { database } from '@/db/database';
import { desc, eq, sql } from 'drizzle-orm';
import { users, accounts, user_favorite_plates, comments } from '@/db/schema';
import UsersTable from '@/components/dashboard/users-table';
import LoginPage from '@/components/login-page';

export default async function UsersPage() {
  const session = await auth();
  if (!session) {
    return <LoginPage />;
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <NotAuthenticated />;
  }

  const favoriteCountSubquery = database
    .select({
      userId: user_favorite_plates.userId,
      count: sql<number>`count(*)`.as('favoriteCount'),
    })
    .from(user_favorite_plates)
    .groupBy(user_favorite_plates.userId)
    .as('favoriteCountSubquery');

  const commentCountSubquery = database
    .select({
      userId: comments.userId,
      count: sql<number>`count(*)`.as('commentCount'),
    })
    .from(comments)
    .groupBy(comments.userId)
    .as('commentCountSubquery');

  const siteUsers = await database
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      provider: accounts.providerId,
      favoriteCount:
        sql<number>`COALESCE(${favoriteCountSubquery.count}, 0)`.as(
          'favoriteCount'
        ),
      commentCount: sql<number>`COALESCE(${commentCountSubquery.count}, 0)`.as(
        'commentCount'
      ),
    })
    .from(users)
    .leftJoin(accounts, eq(users.id, accounts.userId))
    .leftJoin(favoriteCountSubquery, eq(users.id, favoriteCountSubquery.userId))
    .leftJoin(commentCountSubquery, eq(users.id, commentCountSubquery.userId))
    .orderBy(desc(users.createdAt));

  const uniqueProviders = [
    ...new Set(
      siteUsers.map((u) => u.provider).filter((p): p is string => p !== null)
    ),
  ].sort();

  return (
    <div className="container flex flex-col gap-5 py-5">
      <p className="text-2xl">Users</p>
      <UsersTable data={siteUsers} providers={uniqueProviders} />
    </div>
  );
}
