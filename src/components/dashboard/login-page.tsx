import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/auth';
import { headers } from 'next/headers';

import { LayoutDashboard } from 'lucide-react';

import { FaGithub, FaGoogle, FaDiscord } from 'react-icons/fa';

export default function LoginPage() {
  const heads = headers();

  const pathName = heads.get('x-pathname') || '/';

  return (
    <div className='w-full lg:grid  lg:grid-cols-2 '>
      <div className='hidden bg-gray-950 lg:block'>
        <div className='flex flex-col justify-between h-full p-10'>
          <div className='flex items-center gap-2 text-lg font-semibold text-white'>
            <LayoutDashboard className='h-6 w-6' />
            <p>Rate My Plate</p>
          </div>
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
          <div className='grid gap-4'>
            <form
              action={async () => {
                'use server';
                await signIn('github', { redirectTo: `/${pathName}` });
              }}>
              <Button type='submit' variant='outline' className='w-full gap-5'>
                <FaGithub className='size-6' />
                <p>GitHub</p>
              </Button>
            </form>
            <form
              action={async () => {
                'use server';
                await signIn('google', { redirectTo: `/${pathName}` });
              }}>
              <Button type='submit' variant='outline' className='w-full gap-5'>
                <FaGoogle className='size-6' />
                <p>Google</p>
              </Button>
            </form>
            <form
              action={async () => {
                'use server';
                await signIn('discord', { redirectTo: `/${pathName}` });
              }}>
              <Button type='submit' variant='outline' className='w-full gap-5'>
                <FaDiscord className='size-6' />
                <p>Discord</p>
              </Button>
            </form>
          </div>
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
