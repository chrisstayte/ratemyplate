'use client';

import React, { useState } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Plate } from '@/lib/plates';

import { addPlateToFavorites, removePlateFromFavorites } from '@/app/actions';

interface FavoritePlateButtonProps {
  plate: Plate;
  isFavorite: boolean;
}

export default function FavoritePlateButton({
  plate,
  isFavorite,
}: FavoritePlateButtonProps) {
  const [isFavoriteState, setIsFavoriteState] = useState<boolean>(isFavorite);

  return (
    <div>
      <Toggle
        variant='outline'
        pressed={isFavoriteState}
        onPressedChange={async (value) => {
          if (value) {
            await addPlateToFavorites(plate);
            setIsFavoriteState(value);
          } else {
            await removePlateFromFavorites(plate);
            setIsFavoriteState(value);
          }
        }}>
        {isFavoriteState ? 'Favorited' : 'Favorite'}
      </Toggle>
    </div>
  );
}
