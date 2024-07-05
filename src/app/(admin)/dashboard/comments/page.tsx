'use server';

import { auth, isUserAdmin } from '@/auth';
import { redirect } from 'next/navigation';
import NotAuthenticated from '@/components/dashboard/not-authenticated';

import { database } from '@/db/database';
import { desc, eq } from 'drizzle-orm';
import { comments, users } from '@/db/schema';
import { DataTable } from '@/components/dashboard/data-table';
import { commentsColumn } from '@/components/dashboard/comments-column';
import LoginPage from '@/components/dashboard/login-page';
import { comment } from 'postcss';

export default async function CommentsPage() {
  const session = await auth();
  if (!session) {
    return <LoginPage />;
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <NotAuthenticated />;
  }

  const siteComments = await database
    .select({
      id: comments.id,
      comment: comments.comment,
      timestamp: comments.timestamp,
      userEmail: users.email,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .orderBy(desc(comments.timestamp));

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
