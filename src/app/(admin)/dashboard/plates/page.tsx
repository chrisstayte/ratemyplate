'use server';

import { auth, isUserAdmin } from '@/auth';
import NotAuthenticated from '@/components/dashboard/not-authenticated';

import { database } from '@/db/database';
import { desc, eq, sql } from 'drizzle-orm';
import { plates, comments, user_favorite_plates } from '@/db/schema';
import { DataTable } from '@/components/data-table';
import { plateColumns } from '@/components/dashboard/plates-column';
import LoginPage from '@/components/login-page';

export default async function PlatesPage() {
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
    .orderBy(desc(plates.timestamp));

  return (
    <div className='container flex flex-col gap-5 py-5'>
      <p className='text-2xl'>Plates</p>
      <DataTable
        columns={plateColumns}
        data={licensePlates}
        className='w-full'
      />
    </div>
  );
}
