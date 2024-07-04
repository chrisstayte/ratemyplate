'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

export function ThemeMenuRadioOptions() {
  const { theme, setTheme } = useTheme();

  const currentTheme: string = theme === 'system' ? 'system' : theme!;

  return (
    <>
      <DropdownMenuRadioGroup
        value={currentTheme}
        onValueChange={(value) => {
          setTheme(value);
        }}>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioItem value='light'>Light</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value='dark'>Dark</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value='system'>System</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );
}
