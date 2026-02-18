'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import '@/lib/extensions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { deleteComment } from '@/app/actions';

export type Comment = {
  id: number;
  comment: string;
  timestamp: Date;
  userEmail: string | null;
  plateNumber: string | null;
  state: string | null;
};

interface CommentsTableProps {
  tableData: Comment[];
  states: string[];
}

export default function CommentsTable({
  tableData,
  states,
}: CommentsTableProps) {
  const [siteComments, setSiteComments] = useState<Comment[]>(tableData);
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());

  function handleDelete(id: number) {
    setSiteComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
  }

  function toggleState(state: string) {
    setSelectedStates((prev) => {
      const next = new Set(prev);
      if (next.has(state)) {
        next.delete(state);
      } else {
        next.add(state);
      }
      return next;
    });
  }

  const filteredData = siteComments.filter((comment) => {
    if (
      selectedStates.size > 0 &&
      (!comment.state || !selectedStates.has(comment.state))
    )
      return false;
    return true;
  });

  return (
    <div>
      {states.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-4">
          {states.map((state) => (
            <Toggle
              key={state}
              variant="outline"
              size="sm"
              pressed={selectedStates.has(state)}
              onPressedChange={() => toggleState(state)}
            >
              {state}
            </Toggle>
          ))}
        </div>
      )}
      <DataTable
        columns={commentsColumn(handleDelete)}
        data={filteredData}
        className="w-full"
      />
    </div>
  );
}

export const commentsColumn = (
  onDelete: (id: number) => void
): ColumnDef<Comment>[] => [
  {
    accessorKey: 'timestamp',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-center truncate text-sm">
          {row.getValue<Date>('timestamp').prettyDateTime()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'userEmail',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'plateNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Plate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'state',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          State
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'comment',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Comment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: '',
    header: 'Action',
    cell: ({ row }) => {
      return <ActionCell row={row} onDelete={onDelete} />;
    },
  },
];

type ActionCellProps = {
  row: Row<Comment>;
  onDelete: (id: number) => void;
};

const ActionCell: React.FC<ActionCellProps> = ({ row, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={async () => {
            await deleteComment(row.original.id);
            onDelete(row.original.id);
          }}
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
