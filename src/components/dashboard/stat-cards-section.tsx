import React from 'react';
import StatCard from '@/components/dashboard/stat-card';
import { FaUsers } from 'react-icons/fa';
import { TbRectangleFilled } from 'react-icons/tb';
import { FaComment } from 'react-icons/fa6';
import { database } from '@/db/database';
import { sql } from 'drizzle-orm';
import { users, plates, plate_reviews } from '@/db/schema';

export default async function StatCardsSection() {
  const [userResult, plateResult, commentResult] = await Promise.all([
    database.select({ count: sql<number>`cast(count(*) as int)` }).from(users),
    database.select({ count: sql<number>`cast(count(*) as int)` }).from(plates),
    database.select({ count: sql<number>`cast(count(*) as int)` }).from(plate_reviews),
  ]);

  const userCount = userResult[0].count;
  const plateCount = plateResult[0].count;
  const commentCount = commentResult[0].count;

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
