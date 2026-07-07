'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import '@/lib/extensions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  dashboardOutlineButtonClassName,
  dashboardToggleClassName,
  dashboardToolbarClassName,
} from '@/components/dashboard/control-styles';
import { Toggle } from '@/components/ui/toggle';
import { ArrowUpDown, Eye, MoreHorizontal, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { deleteComment } from '@/app/actions';

export type Comment = {
  id: number;
  plateId: number;
  comment: string | null;
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

  useEffect(() => {
    setSiteComments(tableData);
  }, [tableData]);

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
        <div className={`${dashboardToolbarClassName} mb-4`}>
          {states.map((state) => (
            <Toggle
              key={state}
              variant="outline"
              size="sm"
              pressed={selectedStates.has(state)}
              onPressedChange={() => toggleState(state)}
              className={dashboardToggleClassName}
            >
              {state}
            </Toggle>
          ))}
        </div>
      )}
      <div className="grid gap-3 md:hidden">
        {filteredData.length > 0 ? (
          filteredData.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl border bg-card p-4 text-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Badge variant="outline" className="mb-2">
                    {comment.timestamp.prettyDateTime()}
                  </Badge>
                  <div className="truncate font-medium">
                    {comment.plateNumber ?? 'Unknown plate'}
                    {comment.state ? ` - ${comment.state}` : ''}
                  </div>
                  <div className="truncate text-muted-foreground">
                    {comment.userEmail ?? 'Unknown user'}
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/comments/${comment.id}`}>
                    <Eye className="size-4" />
                    View
                  </Link>
                </Button>
              </div>
              <p className="mt-3 whitespace-normal break-words leading-relaxed">
                {comment.comment ?? ''}
              </p>
              <div className="mt-3 flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    await deleteComment(comment.id);
                    handleDelete(comment.id);
                  }}
                >
                  <Trash className="size-4" />
                  Delete
                </Button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
            No results.
          </div>
        )}
      </div>
      <div className="hidden md:block">
        <DataTable
          columns={commentsColumn(handleDelete)}
          data={filteredData}
          className="w-full"
          paginationButtonClassName={dashboardOutlineButtonClassName}
        />
      </div>
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
    cell: ({ row }) => {
      return (
        <span className="block max-w-56 truncate">
          {row.getValue<string | null>('userEmail') ?? 'Unknown'}
        </span>
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
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/plates/${row.original.plateId}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {row.getValue<string | null>('plateNumber') ?? 'Unknown'}
        </Link>
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
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/comments/${row.original.id}`}
          className="block max-w-2xl whitespace-normal break-words leading-relaxed underline-offset-4 hover:underline"
        >
          {row.getValue<string | null>('comment') ?? ''}
        </Link>
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
        <Button variant="ghost" size="icon" aria-label="Open comment actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/comments/${row.original.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View</span>
          </Link>
        </DropdownMenuItem>
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
