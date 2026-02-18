'use client';

import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { plateColumns, type Plate } from '@/components/dashboard/plates-column';
import { Toggle } from '@/components/ui/toggle';
import { MessageSquare, Star } from 'lucide-react';

interface PlatesTableProps {
  data: Plate[];
  states: string[];
}

export default function PlatesTable({ data, states }: PlatesTableProps) {
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());
  const [hasComments, setHasComments] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);

  const filteredData = data.filter((plate) => {
    if (selectedStates.size > 0 && !selectedStates.has(plate.state))
      return false;
    if (hasComments && Number(plate.commentCount) === 0) return false;
    if (hasFavorites && Number(plate.favoriteCount) === 0) return false;
    return true;
  });

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

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 pb-4">
        <Toggle
          variant="outline"
          size="sm"
          pressed={hasComments}
          onPressedChange={setHasComments}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Has Comments
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={hasFavorites}
          onPressedChange={setHasFavorites}
        >
          <Star className="h-3.5 w-3.5" />
          Has Favorites
        </Toggle>
        {states.length > 0 && (
          <>
            <div className="h-5 w-px bg-border" />
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
          </>
        )}
      </div>
      <DataTable columns={plateColumns} data={filteredData} className="w-full" />
    </div>
  );
}
