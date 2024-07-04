import Link from 'next/link';
import React from 'react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import AuthButton from '@/components/public/auth-button';

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
