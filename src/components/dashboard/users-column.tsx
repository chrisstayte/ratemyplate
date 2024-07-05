'use client';

import { ColumnDef } from '@tanstack/react-table';
import '@/lib/extensions';
import { Badge } from '@/components/ui/badge';

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
    header: 'name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className=''>Joined</div>,
    cell: ({ row }) => {
      return (
        <Badge variant='outline'>
          {row.getValue<Date>('createdAt').prettyDateTime()}
        </Badge>
      );
    },
  },
];
