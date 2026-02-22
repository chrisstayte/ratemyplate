import Link from 'next/link';
import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import AuthMenu from '@/components/navbar/auth-menu';

const Navbar = () => {
  return (
    <nav className="bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 sticky top-0 z-50 border-b border-border py-2">
      <div className="max-w-6xl w-full px-5 mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="flex flex-1 items-center gap-2 text-lg font-semibold"
        >
          <LayoutDashboard className="h-6 w-6" />
          <p className="text-xl font-bold">RateMyPlate</p>
        </Link>

        <div className="hidden sm:flex sm:flex-1  sm:grow items-center gap-6 justify-center">
          <Link
            href="/map"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Map
          </Link>
        </div>

        <div className="flex flex-1 gap-2 items-center justify-end">
          <Link
            href="/map"
            className="sm:hidden text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Map
          </Link>
          <AuthMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
