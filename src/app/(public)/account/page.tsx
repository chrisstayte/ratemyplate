import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { redirect } from 'next/navigation';
import '@/lib/extensions';
import { database } from '@/db/database';
import { desc, eq } from 'drizzle-orm';
import { comments, plates } from '@/db/schema';
import { DataTable } from '@/components/data-table';
import { commentsColumn } from '@/components/public/comments-columns';

export default async function Account() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  const user = session?.user;
  const userImageUrl = user?.image ?? undefined;
  const initials = user?.name?.getInitials();

  const userComments = await database
    .select({
      userId: comments.userId,
      comment: comments.comment,
      timestamp: comments.timestamp,
      plateNumber: plates.plateNumber,
      state: plates.state,
    })
    .from(comments)
    .where(eq(comments.userId, user?.id!))
    .leftJoin(plates, eq(comments.plateId, plates.id))
    .orderBy(desc(comments.timestamp));

  return (
    <div className='w-full flex flex-col gap-10'>
      <div className='w-full bg-gray-950  py-10'>
        <div className='text-white flex flex-col justify-center items-center gap-3'>
          <Avatar className='size-28 pointer-events-none'>
            <AvatarImage src={userImageUrl} alt='user image' />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col justify-center items-center'>
            <p className='text-2xl font-bold'>{user?.name}</p>
            <p className='text-xl text-muted-foreground'>{user?.email ?? ''}</p>
          </div>
        </div>
      </div>
      <div className='container w-full flex flex-col gap-5'>
        <p className='text-2xl'>Comments</p>
        <DataTable
          columns={commentsColumn}
          data={userComments}
          className='w-full'
        />
      </div>
    </div>
  );
}
