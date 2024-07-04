import React from 'react';
import NavLink from './navlink';
import '@/lib/extensions';
import AuthMenu from '@/components/dashboard/navbar/auth-menu';
import { Button } from '@/components/ui/button';
import { Menu, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

const Navbar = async () => {
  return (
    <div className=''>
      <header className=''>
        <nav className='h-16 flex'>
          <div className='container mx-auto flex justify-between items-center'>
            <div className=' md:hidden'>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='shrink-0 md:hidden'>
                    <Menu className='h-5 w-5' />
                    <span className='sr-only'>Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className='w-[220px]' side='left'>
                  <nav className='grid gap-6 text-lg font-medium'>
                    <SheetTrigger asChild>
                      <Link
                        href='/dashboard'
                        className='flex items-center gap-2 text-lg font-semibold'>
                        <LayoutDashboard className='h-6 w-6' />
                        <span className='sr-only'>Rate My Plate</span>
                      </Link>
                    </SheetTrigger>
                    <SheetTrigger asChild>
                      <NavLink href='/dashboard'>Dashboard</NavLink>
                    </SheetTrigger>
                    <SheetTrigger asChild>
                      <NavLink href='/dashboard/plates'>Plates</NavLink>
                    </SheetTrigger>
                    <SheetTrigger asChild>
                      <NavLink href='/dashboard/users'>Users</NavLink>
                    </SheetTrigger>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            <div className='hidden md:flex flex-row gap-6'>
              <Link
                href='/dashboard'
                className='flex items-center gap-2 text-lg font-semibold'>
                <LayoutDashboard className='h-6 w-6' />
                <span className='sr-only'>Rate My Plate</span>
              </Link>
              <NavLink href='/dashboard'>Dashboard</NavLink>
              <NavLink href='/dashboard/plates'>Plates</NavLink>
              <NavLink href='/dashboard/users'>Users</NavLink>
            </div>
            <div className='flex gap-2 items-end'>
              <AuthMenu />
            </div>
          </div>
        </nav>
        <hr />
      </header>
    </div>
  );
};

export default Navbar;
