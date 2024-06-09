import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ModeToggle } from '../ui/mode-toggle';
import BuyMeACoffeeButton from './buy-me-a-coffee-button';

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
