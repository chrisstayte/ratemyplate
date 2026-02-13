'use client';

import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { authClient, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

import { FaGithub, FaGoogle, FaDiscord } from 'react-icons/fa';

interface LoginDialogProps {
  buttonTitle?: string;
}

export default function LoginDialog({ buttonTitle }: LoginDialogProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignIn = async (provider: 'github' | 'google' | 'discord') => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: pathname || '/',
      });
      router.refresh();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

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
              <Button
                onClick={() => handleSignIn('github')}
                variant='outline'
                className='w-full gap-5'>
                <FaGithub className='size-6' />
                <p>GitHub</p>
              </Button>
              <Button
                onClick={() => handleSignIn('google')}
                variant='outline'
                className='w-full gap-5'>
                <FaGoogle className='size-6' />
                <p>Google</p>
              </Button>
              <Button
                onClick={() => handleSignIn('discord')}
                variant='outline'
                className='w-full gap-5'>
                <FaDiscord className='size-6' />
                <p>Discord</p>
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Button variant='outline' onClick={handleSignOut}>
        Signout
      </Button>
    );
  }
}
