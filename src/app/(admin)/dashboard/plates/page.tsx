import { database } from '@/db/database';
import { desc, eq, ilike, sql } from 'drizzle-orm';
import { plates, comments, user_favorite_plates } from '@/db/schema';
import PlatesTable from '@/components/dashboard/plates-table';
import { SearchBar } from '@/components/dashboard/search-bar';

export default async function PlatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const favoriteCountSubquery = database
    .select({
      plateId: user_favorite_plates.plateId,
      count: sql<number>`count(*)`.as('favoriteCount'),
    })
    .from(user_favorite_plates)
    .groupBy(user_favorite_plates.plateId)
    .as('favoriteCountSubquery');

  const commentCountSubquery = database
    .select({
      plateId: comments.plateId,
      count: sql<number>`count(*)`.as('commentCount'),
    })
    .from(comments)
    .groupBy(comments.plateId)
    .as('commentCountSubquery');

  const licensePlates = await database
    .select({
      id: plates.id,
      state: plates.state,
      plateNumber: plates.plateNumber,
      timestamp: plates.timestamp,
      favoriteCount:
        sql<number>`COALESCE(${favoriteCountSubquery.count}, 0)`.as(
          'favoriteCount'
        ),
      commentCount: sql<number>`COALESCE(${commentCountSubquery.count}, 0)`.as(
        'commentCount'
      ),
    })
    .from(plates)
    .leftJoin(
      favoriteCountSubquery,
      eq(plates.id, favoriteCountSubquery.plateId)
    )
    .leftJoin(commentCountSubquery, eq(plates.id, commentCountSubquery.plateId))
    .where(q ? ilike(plates.plateNumber, `%${q}%`) : undefined)
    .orderBy(desc(plates.timestamp));

  const statesResult = await database
    .selectDistinct({ state: plates.state })
    .from(plates);
  const uniqueStates = statesResult.map((r) => r.state).sort();

  return (
    <div className="container flex flex-col gap-5 py-5">
      <p className="text-2xl">Plates</p>
      <SearchBar placeholder="Search plate number..." />
      <PlatesTable data={licensePlates} states={uniqueStates} />
    </div>
  );
}
