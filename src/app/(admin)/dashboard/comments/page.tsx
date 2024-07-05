'use server';

import { auth, isUserAdmin } from '@/auth';
import { redirect } from 'next/navigation';
import NotAuthenticated from '@/components/dashboard/not-authenticated';

import { database } from '@/db/database';
import { desc } from 'drizzle-orm';
import { comments } from '@/db/schema';
import { DataTable } from '@/components/dashboard/data-table';
import { commentsColumn } from '@/components/dashboard/comments-column';

export default async function CommentsPage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/dashboard/users');
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <NotAuthenticated />;
  }

  const siteComments = await database.query.comments.findMany({
    columns: {
      id: true,
      comment: true,
      timestamp: true,
    },
    orderBy: [desc(comments.timestamp)],
  });

  return (
    <div className='container flex flex-col gap-5 py-5'>
      <p className='text-2xl'>Comments</p>
      <DataTable
        columns={commentsColumn}
        data={siteComments}
        className='w-full'
      />
    </div>
  );
}
