import Link from 'next/link';
import React from 'react';
import { ModeToggle } from '../ui/mode-toggle';
import { signIn, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import AuthButton from '../auth-button';

const Navbar = () => {
  return (
    <nav className='h-14 flex'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/'>
          <p className='text-xl font-bold'>RateMyPlate</p>
        </Link>

        <div className='flex gap-2 items-end'>
          {/* <BuyMeACoffeeButton className='max-sm:hidden' /> */}
          <ModeToggle />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
