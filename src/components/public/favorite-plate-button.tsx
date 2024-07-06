'use client';

import React, { useState } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Plate } from '@/lib/plates';

import { addPlateToFavorites, removePlateFromFavorites } from '@/app/actions';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { Button } from '@/components/ui/button';

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
      <div
        onClick={async () => {
          if (isFavoriteState) {
            await removePlateFromFavorites(plate);
            setIsFavoriteState(false);
          } else {
            await addPlateToFavorites(plate);
            setIsFavoriteState(true);
          }
        }}>
        {isFavoriteState ? (
          <MdFavorite className='size-8 ' color='red' />
        ) : (
          <MdFavoriteBorder className='size-8' />
        )}
      </div>
    </div>
  );
}
