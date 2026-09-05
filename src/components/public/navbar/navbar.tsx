import Link from 'next/link';
import React from 'react';
import { Globe2 } from 'lucide-react';
import { BrandMark } from '@/components/brand-mark';
import AuthMenu from '@/components/navbar/auth-menu';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  return (
    <nav className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90 sticky top-0 z-50 border-b border-border py-3">
      <div className="max-w-6xl w-full px-5 mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="flex flex-1 items-center gap-2 text-lg font-semibold"
        >
          <BrandMark className="size-7 shrink-0 text-primary" />
          <p className="text-lg font-semibold tracking-tight">RateMyPlate</p>
        </Link>

        <div className="hidden md:flex md:flex-1 md:grow items-center gap-5 justify-center">
          <Link href="/globe" className="group">
            <Badge variant="outline" className="rounded-md border-border bg-secondary/50 px-3 py-1.5 font-medium text-primary hover:bg-accent">
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
