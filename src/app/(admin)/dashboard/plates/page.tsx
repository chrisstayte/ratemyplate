import PlatesTable from '@/components/dashboard/plates-table';
import { SearchBar } from '@/components/dashboard/search-bar';
import { getAdminPlatesPageData } from '@/db/queries/admin-plates';

export default async function PlatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { licensePlates, uniqueStates } = await getAdminPlatesPageData(q);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 py-5">
      <p className="text-2xl">Plates</p>
      <SearchBar placeholder="Search plate number..." />
      <PlatesTable data={licensePlates} states={uniqueStates} />
    </div>
  );
}
