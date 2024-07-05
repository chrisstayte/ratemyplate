import Link from 'next/link';
import React from 'react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import LoginDialog from '../login-dialog';
import { LayoutDashboard } from 'lucide-react';
import AuthMenu from '@/components/navbar/auth-menu';

const Navbar = () => {
  return (
    <nav className='h-16 flex'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link
          href='/'
          className='flex items-center gap-2 text-lg font-semibold'>
          <LayoutDashboard className='h-6 w-6' />
          <p className='text-xl font-bold'>RateMyPlate</p>
        </Link>

        <div className='flex gap-2 items-end'>
          <AuthMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
