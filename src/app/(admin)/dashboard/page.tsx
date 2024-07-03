'use server';

import { auth, isUserAdmin } from '@/auth';
import { redirect } from 'next/navigation';
import { database } from '@/db/database';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/dashboard');
  }

  const user = session.user;

  const userRoles = await database.query.user_roles.findMany({
    where: (user_roles) => eq(user_roles.userId, user!.id!),
    with: {
      user: true,
      role: true,
    },
  });

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return (
      <div className='container min-h-screen flex flex-col justify-center items-center gap-10'>
        <p className='text-2xl text-red-500 font-bold'>Unauthorized</p>
        <Link href='/'>
          <Button>Go Home </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='container flex flex-col gap-10 py-10 items-center'>
      <div className='flex flex-col gap-5  min-h-36 justify-center items-center'>
        <p>TEST</p>
      </div>
    </div>
  );
}
