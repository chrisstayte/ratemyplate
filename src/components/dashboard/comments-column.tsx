'use client';

import { ColumnDef } from '@tanstack/react-table';
import '@/lib/extensions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

// This is the type used to define the shape of our data.
// I can use a zod schema if i want

export type Comment = {
  id: number;
  comment: string;
  timestamp: Date;
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
        <Badge variant='outline' className='text-center'>
          {row.getValue<Date>('timestamp').prettyDateTime()}
        </Badge>
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
];