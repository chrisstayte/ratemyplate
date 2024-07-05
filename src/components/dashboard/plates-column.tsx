'use client';

import { ColumnDef } from '@tanstack/react-table';
import '@/lib/extensions';

import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// This is the type used to define the shape of our data.
// I can use a zod schema if i want

export type Plate = {
  id: number;
  plateNumber: string;
  state: string;
  timestamp: Date;
};

export const plateColumns: ColumnDef<Plate>[] = [
  {
    accessorKey: 'plateNumber',
    header: 'Plate Number',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'timestamp',
    header: () => <div className=''>Timestamp</div>,
    cell: ({ row }) => {
      return (
        <Badge variant='outline'>
          {row.getValue<Date>('timestamp').prettyDateTime()}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const plate = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(plate.plateNumber)}>
              Copy plate number
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View comments</DropdownMenuItem>
            <DropdownMenuItem>View user</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
