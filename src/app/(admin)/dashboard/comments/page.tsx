'use server';

import { auth, isUserAdmin } from '@/auth';
import NotAuthenticated from '@/components/dashboard/not-authenticated';
import { database } from '@/db/database';
import { desc, eq } from 'drizzle-orm';
import { comments, users, plates } from '@/db/schema';
import LoginPage from '@/components/login-page';
import CommentsTable from '@/components/dashboard/comments-table';
import { SearchBar } from '@/components/dashboard/search-bar';

export default async function CommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const session = await auth();
  if (!session) {
    return <LoginPage />;
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <NotAuthenticated />;
  }

  const allComments = await database
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

  const siteComments = q
    ? allComments.filter((c) => {
        const query = q.toLowerCase();
        const matchesPlate =
          c.plateNumber?.toLowerCase().includes(query) ?? false;
        const matchesUser =
          c.userEmail?.toLowerCase().includes(query) ?? false;
        const matchesComment = c.comment.toLowerCase().includes(query);
        return matchesPlate || matchesUser || matchesComment;
      })
    : allComments;

  const uniqueStates = [
    ...new Set(
      allComments.map((c) => c.state).filter((s): s is string => s !== null)
    ),
  ].sort();

  return (
    <div className="container flex flex-col gap-5 py-5">
      <p className="text-2xl">Comments</p>
      <SearchBar placeholder="Search by plate, user, or comment..." />
      <CommentsTable tableData={siteComments} states={uniqueStates} />
    </div>
  );
}
