'use client';

import { ColumnDef } from '@tanstack/react-table';
import '@/lib/extensions';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This is the type used to define the shape of our data.
// I can use a zod schema if i want

export type User = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
};

export const usersColumn: ColumnDef<User>[] = [
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
  },
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
        <Badge variant='outline' className='text-center'>
          {row.getValue<Date>('createdAt').prettyDateTime()}
        </Badge>
      );
    },
  },
];
