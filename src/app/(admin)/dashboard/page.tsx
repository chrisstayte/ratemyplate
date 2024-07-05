'use server';

import { auth, isUserAdmin } from '@/auth';
import { redirect } from 'next/navigation';
import NotAuthenticated from '@/components/dashboard/not-authenticated';
import StatCard from '@/components/dashboard/stat-card';
import { database } from '@/db/database';

import { FaUsers } from 'react-icons/fa';
import { TbRectangleFilled } from 'react-icons/tb';

import { FaComment } from 'react-icons/fa6';
import LoginPage from '@/components/dashboard/login-page';

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    return <LoginPage />;
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <NotAuthenticated />;
  }

  const userCount: number = (await database.query.users.findMany()).length;
  const plateCount: number = (await database.query.plates.findMany()).length;
  const commentCount: number = (await database.query.comments.findMany())
    .length;

  return (
    <div className='container flex flex-col gap-10 py-10 '>
      <div className='flex flex-col gap-5  '>
        <div className='grid grid-cols-* sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 '>
          <StatCard
            title='User Count'
            value={`${userCount}`}
            subtitle=''
            Icon={FaUsers}
          />
          <StatCard
            title='Plate Count'
            value={`${plateCount}`}
            subtitle=''
            Icon={TbRectangleFilled}
          />
          <StatCard
            title='Comment Count'
            value={`${commentCount}`}
            subtitle=''
            Icon={FaComment}
          />
        </div>
      </div>
    </div>
  );
}
