import { database } from '@/db/database';
import { desc, eq, ilike, or, sql } from 'drizzle-orm';
import { users, accounts, user_favorite_plates, comments } from '@/db/schema';
import UsersTable from '@/components/dashboard/users-table';
import { SearchBar } from '@/components/dashboard/search-bar';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

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
    .where(
      q
        ? or(ilike(users.name, `%${q}%`), ilike(users.email, `%${q}%`))
        : undefined
    )
    .orderBy(desc(users.createdAt));

  const providersResult = await database
    .selectDistinct({ provider: accounts.providerId })
    .from(accounts);
  const uniqueProviders = providersResult
    .map((r) => r.provider)
    .filter((p): p is string => p !== null)
    .sort();

  return (
    <div className="container flex flex-col gap-5 py-5">
      <p className="text-2xl">Users</p>
      <SearchBar placeholder="Search by name or email..." />
      <UsersTable data={siteUsers} providers={uniqueProviders} />
    </div>
  );
}
