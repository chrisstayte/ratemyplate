'use server';

import { auth, isUserAdmin } from '@/auth';
import { redirect } from 'next/navigation';
import NotAuthenticated from '@/components/dashboard/not-authenticated';

export default async function UsersPage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/dashboard/users');
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <NotAuthenticated />;
  }

  return (
    <div className='container flex flex-col gap-10 py-10 items-center'>
      <div className='flex flex-col gap-5  min-h-36 justify-center items-center'>
        <p className='text-5xl text-center'>Users</p>
      </div>
    </div>
  );
}
