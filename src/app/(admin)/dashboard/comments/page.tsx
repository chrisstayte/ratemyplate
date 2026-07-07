import CommentsTable from '@/components/dashboard/comments-table';
import { SearchBar } from '@/components/dashboard/search-bar';
import { getAdminCommentsPageData } from '@/db/queries/admin-comments';

export default async function CommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { siteComments, uniqueStates } = await getAdminCommentsPageData(q);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 py-5">
      <p className="text-2xl">Comments</p>
      <SearchBar placeholder="Search by plate, user, or comment..." />
      <CommentsTable tableData={siteComments} states={uniqueStates} />
    </div>
  );
}
