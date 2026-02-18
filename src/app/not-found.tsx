import Navbar from '@/components/public/navbar/navbar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

function NotFound() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />

      <div className='w-full grow flex flex-col items-center justify-center p-5 gap-10'>
        <div className='flex flex-col items-center gap-5'>
          <p className='text-3xl'>Whoops!</p>
          <p className='text-lgs'>You might have gotten lost</p>
        </div>
        <div className='flex flex-col gap-2 items-end'>
          <Image
            className='pointer-events-none rounded-lg'
            src='/images/404.webp'
            alt='404'
            width={450}
            height={450}
          />
          <p className='text-xs'>Image generate with GPT4-o</p>
        </div>
        <Link href='/'>
          <Button>See plates!</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
