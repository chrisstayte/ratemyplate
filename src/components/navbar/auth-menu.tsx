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
import { signOut, auth } from '@/auth';
import { ThemeMenuRadioOptions } from '@/components/navbar/theme-menu-radio-options';
import LoginDialog from '@/components/public/login-dialog';
import '@/lib/extensions';

export default async function AuthMenu() {
  const session = await auth();

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
        <form
          className='w-full'
          action={async () => {
            'use server';
            await signOut();
          }}>
          <button type='submit' className='w-full'>
            <DropdownMenuItem>Signout</DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
