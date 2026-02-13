'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { FaGithub, FaGoogle, FaDiscord } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export function SocialSignInButtons({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();

  const handleSignIn = async (provider: 'github' | 'google' | 'discord') => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: redirectTo || '/',
      });
      router.refresh();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className='grid gap-4'>
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
  );
}
