import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function NotAuthenticated() {
  return (
    <div className='container min-h-screen flex flex-col justify-center items-center gap-10'>
      <p className='text-2xl text-red-500 font-bold'>Unauthorized</p>
      <Link href='/'>
        <Button>Go Home </Button>
      </Link>
    </div>
  );
}
