'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import '@/lib/extensions';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This is the type used to define the shape of our data.
// I can use a zod schema if i want

export type User = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  provider: string | null;
  favoriteCount: number;
  commentCount: number;
};

export const usersColumn: ColumnDef<User>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Joined
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge variant='outline' className='text-center truncate text-sm'>
          {row.getValue<Date>('createdAt').prettyDateTime()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/users/${row.original.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {row.getValue<string | null>('name') ?? 'Unknown'}
        </Link>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/users/${row.original.id}`}
          className="block max-w-72 truncate underline-offset-4 hover:underline"
        >
          {row.getValue<string>('email')}
        </Link>
      );
    },
  },
  {
    accessorKey: 'provider',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Provider
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const provider = row.getValue<string | null>('provider');
      return (
        <Badge className='text-center truncate text-sm'>
          {provider ? provider.capitalize() : 'None'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'commentCount',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Comments
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'favoriteCount',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Favorites
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
];
