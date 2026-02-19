import { database } from '@/db/database';
import { desc, eq, ilike, or } from 'drizzle-orm';
import { comments, users, plates } from '@/db/schema';
import CommentsTable from '@/components/dashboard/comments-table';
import { SearchBar } from '@/components/dashboard/search-bar';

export default async function CommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

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
    .where(
      q
        ? or(
            ilike(plates.plateNumber, `%${q}%`),
            ilike(users.email, `%${q}%`),
            ilike(comments.comment, `%${q}%`)
          )
        : undefined
    )
    .orderBy(desc(comments.timestamp));

  const statesResult = await database
    .selectDistinct({ state: plates.state })
    .from(plates);
  const uniqueStates = statesResult
    .map((r) => r.state)
    .filter((s): s is string => s !== null)
    .sort();

  return (
    <div className="container mx-auto flex flex-col gap-5 py-5">
      <p className="text-2xl">Comments</p>
      <SearchBar placeholder="Search by plate, user, or comment..." />
      <CommentsTable tableData={siteComments} states={uniqueStates} />
    </div>
  );
}
