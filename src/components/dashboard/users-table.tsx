'use client';

import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { usersColumn, type User } from '@/components/dashboard/users-column';
import { Toggle } from '@/components/ui/toggle';
import { MessageSquare, Star } from 'lucide-react';

interface UsersTableProps {
  data: User[];
  providers: string[];
}

export default function UsersTable({ data, providers }: UsersTableProps) {
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(
    new Set()
  );
  const [hasComments, setHasComments] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);

  const filteredData = data.filter((user) => {
    if (
      selectedProviders.size > 0 &&
      (!user.provider || !selectedProviders.has(user.provider))
    )
      return false;
    if (hasComments && Number(user.commentCount) === 0) return false;
    if (hasFavorites && Number(user.favoriteCount) === 0) return false;
    return true;
  });

  function toggleProvider(provider: string) {
    setSelectedProviders((prev) => {
      const next = new Set(prev);
      if (next.has(provider)) {
        next.delete(provider);
      } else {
        next.add(provider);
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
        {providers.length > 0 && (
          <>
            <div className="h-5 w-px bg-border" />
            {providers.map((provider) => (
              <Toggle
                key={provider}
                variant="outline"
                size="sm"
                pressed={selectedProviders.has(provider)}
                onPressedChange={() => toggleProvider(provider)}
              >
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </Toggle>
            ))}
          </>
        )}
      </div>
      <DataTable columns={usersColumn} data={filteredData} className="w-full" />
    </div>
  );
}
