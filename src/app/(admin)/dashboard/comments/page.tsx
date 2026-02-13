'use server';

import { getCurrentUser, isUserAdmin } from '@/lib/auth';
import NotAuthenticated from '@/components/dashboard/not-authenticated';
import { database } from '@/db/database';
import { desc, eq } from 'drizzle-orm';
import { comments, users, plates } from '@/db/schema';
import LoginPage from '@/components/login-page';
import CommentsTable from '@/components/dashboard/comments-table';

export default async function CommentsPage() {
  const session = await getCurrentUser();
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
      plateNumber: plates.plateNumber,
      state: plates.state,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .leftJoin(plates, eq(comments.plateId, plates.id))
    .orderBy(desc(comments.timestamp));

  return (
    <div className='container flex flex-col gap-5 py-5'>
      <p className='text-2xl'>Comments</p>
      <CommentsTable tableData={siteComments} />
    </div>
  );
}
