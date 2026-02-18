import React from 'react';
import StatCard from '@/components/dashboard/stat-card';
import { FaUsers } from 'react-icons/fa';
import { TbRectangleFilled } from 'react-icons/tb';
import { FaComment } from 'react-icons/fa6';
import { database } from '@/db/database';
import { auth, isUserAdmin } from '@/auth';

export default async function StatCardsSection() {
  const session = await auth();
  if (!session) {
    return <p>NOT AUTHENTICATED</p>;
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <p>NOT AUTHENTICATED</p>;
  }

  const userCount: number = (await database.query.users.findMany()).length;
  const plateCount: number = (await database.query.plates.findMany()).length;
  const commentCount: number = (await database.query.comments.findMany())
    .length;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
      <StatCard
        title='Plates'
        href='/dashboard/plates'
        value={`${plateCount}`}
        subtitle=''
        Icon={TbRectangleFilled}
      />
      <StatCard
        title='Users'
        href='/dashboard/users'
        value={`${userCount}`}
        subtitle=''
        Icon={FaUsers}
      />
      <StatCard
        title='Comments'
        href='/dashboard/comments'
        value={`${commentCount}`}
        subtitle=''
        Icon={FaComment}
      />
    </div>
  );
}
