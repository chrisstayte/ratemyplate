'use server';

import { auth, isUserAdmin } from '@/auth';
import { redirect } from 'next/navigation';
import NotAuthenticated from '@/components/dashboard/not-authenticated';

import { database } from '@/db/database';
import { desc, eq, sql } from 'drizzle-orm';
import { plates, comments } from '@/db/schema';
import { DataTable } from '@/components/data-table';
import { plateColumns } from '@/components/dashboard/plates-column';
import LoginPage from '@/components/dashboard/login-page';

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

  const licensePlates = await database
    .select({
      id: plates.id,
      plateNumber: plates.plateNumber,
      state: plates.state,
      timestamp: plates.timestamp,
      commentCount: sql<number>`cast(count(${comments.plateId}) as int)`.as(
        'commentCount'
      ),
    })
    .from(plates)
    .leftJoin(comments, eq(plates.id, comments.plateId))
    .groupBy(plates.plateNumber, plates.state, plates.id)
    .orderBy(({ timestamp }) => desc(timestamp));

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
