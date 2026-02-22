import { database } from '@/db/database';
import { desc, eq, ilike, or } from 'drizzle-orm';
import { plate_reviews, users, plates } from '@/db/schema';
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
      id: plate_reviews.id,
      comment: plate_reviews.comment,
      timestamp: plate_reviews.createdAt,
      userEmail: users.email,
      plateNumber: plates.plateNumber,
      state: plates.state,
    })
    .from(plate_reviews)
    .leftJoin(users, eq(plate_reviews.userId, users.id))
    .leftJoin(plates, eq(plate_reviews.plateId, plates.id))
    .where(
      q
        ? or(
            ilike(plates.plateNumber, `%${q}%`),
            ilike(users.email, `%${q}%`),
            ilike(plate_reviews.comment, `%${q}%`)
          )
        : undefined
    )
    .orderBy(desc(plate_reviews.createdAt));

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
