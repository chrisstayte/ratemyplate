import Link from 'next/link';
import React from 'react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import LoginDialog from '../login-dialog';
import { LayoutDashboard, MapIcon } from 'lucide-react';
import AuthMenu from '@/components/navbar/auth-menu';

const Navbar = () => {
  return (
    <nav className="bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 sticky top-0 z-50 border-b border-slate-200 py-2">
      <div className="max-w-6xl w-full px-5 mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <LayoutDashboard className="h-6 w-6" />
          <p className="text-xl font-bold">RateMyPlate</p>
        </Link>

        <div className="flex gap-2 items-center">
          <Link
            href="/map"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapIcon className="h-5 w-5" />
          </Link>
          <AuthMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
