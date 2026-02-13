import Image from 'next/image';
import Link from 'next/link';

import { headers } from 'next/headers';

import { LayoutDashboard } from 'lucide-react';

import { SocialSignInButtons } from '@/components/auth/social-signin-buttons';

export default async function LoginPage() {
  const heads = await headers();

  const pathName = heads.get('x-pathname') || '/';

  return (
    <div className='w-full lg:grid  lg:grid-cols-2 '>
      <div className='hidden bg-gray-950 lg:block'>
        <div className='flex flex-col justify-between h-full p-10'>
          <Link href='/'>
            <div className='flex items-center gap-2 text-lg font-semibold text-white'>
              <LayoutDashboard className='h-6 w-6' />
              <p>Rate My Plate</p>
            </div>
          </Link>
          <div className='text-white'>
            <p>Rate drivers anonymously</p>
          </div>
        </div>

        {/* <Image
          src='/placeholder.svg'
          alt='Image'
          width='1920'
          height='1080'
          className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        /> */}
      </div>
      <div className='flex items-center justify-center py-12 h-full'>
        <div className='mx-auto grid w-[350px] gap-6'>
          <div className='grid gap-2 text-center'>
            <h1 className='text-3xl font-bold'>Login</h1>
          </div>
          <SocialSignInButtons redirectTo={pathName} />
          {/* <div className='mt-4 text-center text-sm'>
            By logging in you agree to our{' '}
            <Link href='#' className='underline'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href='#' className='underline'>
              Privacy Policy{' '}
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}
