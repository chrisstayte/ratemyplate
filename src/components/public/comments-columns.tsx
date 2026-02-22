'use client';

import { ColumnDef } from '@tanstack/react-table';
import '@/lib/extensions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// This is the type used to define the shape of our data.
// I can use a zod schema if i want

export type Comment = {
  comment: string;
  timestamp: Date;
  plateNumber: string | null;
  state: string | null;
};

export const commentsColumn: ColumnDef<Comment>[] = [
  {
    accessorKey: 'timestamp',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Added
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge variant='outline' className='text-center truncate text-sm'>
          {row.getValue<Date>('timestamp').prettyDateTime()}
        </Badge>
      );
    },
  },

  {
    accessorKey: 'plateNumber',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Plate
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'state',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          State
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'comment',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Comment
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: '',
    header: 'Open',
    cell: ({ row }) => {
      return (
        <Link
          className='cursor-pointer'
          href={`/${row.getValue<String>('state')}/${row.getValue<String>('plateNumber')}`}>
          <ExternalLink className='h-4 w-4' />
        </Link>
      );
    },
  },
];
