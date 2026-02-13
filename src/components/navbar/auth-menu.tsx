'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { authClient, useSession } from '@/lib/auth-client';
import { ThemeMenuRadioOptions } from '@/components/navbar/theme-menu-radio-options';
import LoginDialog from '@/components/public/login-dialog';
import '@/lib/extensions';
import { useRouter } from 'next/navigation';

export default function AuthMenu() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  if (isPending) {
    return (
      <Button variant='secondary' size='icon' className='rounded-full'>
        <div className='h-8 w-8 animate-pulse rounded-full bg-gray-300' />
      </Button>
    );
  }

  if (!session) {
    return <LoginDialog />;
  }

  const user = session?.user;
  const userImageUrl = user?.image ?? undefined;
  const initials = user?.name?.getInitials();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon' className='rounded-full'>
          <Avatar>
            <AvatarImage src={userImageUrl} alt='user image' />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className='sr-only'>Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <Link href='/account'>
          <DropdownMenuItem>Manage</DropdownMenuItem>
        </Link>
        <Link href='/favorites'>
          <DropdownMenuItem>Favorites</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <ThemeMenuRadioOptions />
        <DropdownMenuSeparator />
        <button type='button' onClick={handleSignOut} className='w-full'>
          <DropdownMenuItem>Signout</DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
