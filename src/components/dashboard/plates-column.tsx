'use client';

import { ColumnDef } from '@tanstack/react-table';

// This is the type used to define the shape of our data.
// I can use a zod schema if i want

export type Plate = {
  id: number;
  plateNumber: string;
  state: string;
  timestamp: Date | null;
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
    header: () => <div className='text-right'>Timestamp</div>,
  },
];
