import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { auth, signIn, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { headers } from 'next/headers';

import { FaGithub, FaGoogle, FaDiscord } from 'react-icons/fa';

interface LoginDialogProps {
  buttonTitle?: string;
}

export default async function LoginDialog({ buttonTitle }: LoginDialogProps) {
  const session = await auth();

  if (!session?.user) {
    return (
      <Dialog>
        <DialogTrigger>
          <Button>{buttonTitle ?? 'Signin'}</Button>
        </DialogTrigger>
        <DialogContent className='w-11/12'>
          <DialogHeader>
            <DialogTitle>Signin</DialogTitle>
            <DialogDescription>
              Signin to RateMyPlate to rate plates and share your own.
            </DialogDescription>
            <div className='grid gap-4 pt-5'>
              <form
                action={async () => {
                  'use server';

                  const heads = headers();

                  const pathName = heads.get('x-fullPath') || '/';

                  await signIn('github', { redirectTo: `${pathName}` });
                }}>
                <Button
                  type='submit'
                  variant='outline'
                  className='w-full gap-5'>
                  <FaGithub className='size-6' />
                  <p>GitHub</p>
                </Button>
              </form>
              <form
                action={async () => {
                  'use server';
                  const heads = headers();

                  const pathName = heads.get('x-fullPath') || '/';
                  await signIn('google', { redirectTo: `${pathName}` });
                }}>
                <Button
                  type='submit'
                  variant='outline'
                  className='w-full gap-5'>
                  <FaGoogle className='size-6' />
                  <p>Google</p>
                </Button>
              </form>
              <form
                action={async () => {
                  'use server';
                  const heads = headers();

                  const pathName = heads.get('x-fullPath') || '/';
                  await signIn('discord', { redirectTo: `${pathName}` });
                }}>
                <Button
                  type='submit'
                  variant='outline'
                  className='w-full gap-5'>
                  <FaDiscord className='size-6' />
                  <p>Discord</p>
                </Button>
              </form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <form
        action={async () => {
          'use server';
          await signOut();
        }}>
        <Button variant='outline' type='submit'>
          Signout
        </Button>
      </form>
    );
  }
}
