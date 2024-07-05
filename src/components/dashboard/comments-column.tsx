'use client';

import { ColumnDef } from '@tanstack/react-table';
import '@/lib/extensions';
import { Badge } from '@/components/ui/badge';

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
    header: () => <div className=''>Added</div>,
    cell: ({ row }) => {
      return (
        <Badge variant='outline'>
          {row.getValue<Date>('timestamp').prettyDateTime()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'comment',
    header: 'Comment',
  },
];
