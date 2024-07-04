import Link from 'next/link';
import React from 'react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import AuthButton from '@/components/public/auth-button';
import NavLink from './navlink';

const Navbar = () => {
  return (
    <div className=''>
      <header className=''>
        <nav className='h-16 flex'>
          <div className='container mx-auto flex justify-between items-center'>
            <div className='flex flex-row gap-10'>
              <NavLink href='/dashboard'>Dashboard</NavLink>
              <NavLink href='/dashboard/plates'>Plates</NavLink>
              <NavLink href='/dashboard/users'>Users</NavLink>
            </div>
            <div className='flex gap-2 items-end'>
              <ModeToggle />
              <AuthButton />
            </div>
          </div>
        </nav>
        <hr />
      </header>
    </div>
  );
};

export default Navbar;
