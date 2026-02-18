'use client';

import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { usersColumn, type User } from '@/components/dashboard/users-column';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Search, MessageSquare, Star } from 'lucide-react';

interface UsersTableProps {
  data: User[];
  providers: string[];
}

export default function UsersTable({ data, providers }: UsersTableProps) {
  const [search, setSearch] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(
    new Set()
  );
  const [hasComments, setHasComments] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);

  const filteredData = data.filter((user) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesName = user.name?.toLowerCase().includes(q) ?? false;
      const matchesEmail = user.email.toLowerCase().includes(q);
      if (!matchesName && !matchesEmail) return false;
    }
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
      <div className="flex flex-col gap-3 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
      </div>
      <DataTable columns={usersColumn} data={filteredData} className="w-full" />
    </div>
  );
}
