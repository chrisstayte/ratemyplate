import Link from 'next/link';
import React from 'react';
import { Globe2, LayoutDashboard } from 'lucide-react';
import AuthMenu from '@/components/navbar/auth-menu';
import { Badge } from '@/components/ui/badge';

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

        <div className="hidden md:flex md:flex-1 md:grow items-center gap-5 justify-center">
          <Link href="/globe" className="group">
            <Badge className="bg-purple-600 text-white hover:bg-purple-500">
              <Globe2 className="transition-transform duration-500 group-hover:rotate-45" />
              Live Globe
            </Badge>
          </Link>
        </div>

        <div className="flex flex-1 gap-2 items-center justify-end">
          <AuthMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
