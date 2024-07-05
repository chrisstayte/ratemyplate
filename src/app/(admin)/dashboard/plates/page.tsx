'use server';

import { auth, isUserAdmin } from '@/auth';
import { redirect } from 'next/navigation';
import NotAuthenticated from '@/components/dashboard/not-authenticated';

import { database } from '@/db/database';
import { desc } from 'drizzle-orm';
import { plates } from '@/db/schema';
import { DataTable } from '@/components/dashboard/data-table';
import { plateColumns } from '@/components/dashboard/plates-column';

export default async function PlatesPage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/dashboard/plates');
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <NotAuthenticated />;
  }

  const licensePlates = await database.query.plates.findMany({
    columns: {
      id: true,
      plateNumber: true,
      state: true,
      timestamp: true,
    },
    orderBy: [desc(plates.timestamp)],
  });

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
