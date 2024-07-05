'use server';

import { auth, isUserAdmin } from '@/auth';
import { redirect } from 'next/navigation';
import NotAuthenticated from '@/components/dashboard/not-authenticated';

import { database } from '@/db/database';
import { desc } from 'drizzle-orm';
import { users } from '@/db/schema';
import { DataTable } from '@/components/dashboard/data-table';
import { usersColumn } from '@/components/dashboard/users-column';
import LoginPage from '@/components/dashboard/login-page';

export default async function UsersPage() {
  const session = await auth();
  if (!session) {
    return <LoginPage />;
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <NotAuthenticated />;
  }

  const siteUsers = await database.query.users.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: [desc(users.createdAt)],
  });

  return (
    <div className='container flex flex-col gap-5 py-5'>
      <p className='text-2xl'>Users</p>
      <DataTable columns={usersColumn} data={siteUsers} className='w-full' />
    </div>
  );
}
