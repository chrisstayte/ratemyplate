import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { redirect } from 'next/navigation';

export default async function Account() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  const user = session?.user;
  const userImageUrl = user?.image ?? undefined;
  const initials = user?.name?.getInitials();

  return (
    <div className='w-full flex flex-col gap-10'>
      <div className='w-full bg-gray-950  py-10'>
        <div className='text-white flex flex-col justify-center items-center gap-3'>
          <Avatar className='size-28 '>
            <AvatarImage src={userImageUrl} alt='user image' />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col justify-center items-center'>
            <p className='text-2xl font-bold'>{user?.name}</p>
            <p className='text-xl text-muted-foreground'>{user?.email ?? ''}</p>
          </div>
        </div>
      </div>
      <div className='container w-full'>
        <p className='text-2xl'>Comments</p>
      </div>
    </div>
  );
}
