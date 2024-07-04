'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MouseEventHandler } from 'react';

interface NavLinkProps {
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  children: React.ReactNode;
}

const NavLink = ({ href, onClick, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isCurrentPage = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-muted-foreground transition-colors hover:text-foreground  lg:inline-block ${
        isCurrentPage && 'font-semibold'
      }`}>
      {children}
    </Link>
  );
};

export default NavLink;
