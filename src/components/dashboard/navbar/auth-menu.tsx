import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { signOut, auth } from '@/auth';
import { ThemeMenuRadioOptions } from './theme-menu-radio-options';

export default async function AuthMenu() {
  const session = await auth();

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
