import UsersTable from '@/components/dashboard/users-table';
import { SearchBar } from '@/components/dashboard/search-bar';
import { getAdminUsersPageData } from '@/db/queries/admin-users';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { siteUsers, uniqueProviders } = await getAdminUsersPageData(q);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 py-5">
      <p className="text-2xl">Users</p>
      <SearchBar placeholder="Search by name or email..." />
      <UsersTable data={siteUsers} providers={uniqueProviders} />
    </div>
  );
}
