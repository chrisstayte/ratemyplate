'use client';

import React, { useState } from 'react';
import { Plate } from '@/lib/plates';

import { addPlateToFavorites, removePlateFromFavorites } from '@/app/actions';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { motion } from 'framer-motion';

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
    <motion.div whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }}>
      <div
        className='size-10'
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
          <MdFavorite className='size-full' color='red' />
        ) : (
          <MdFavoriteBorder className='size-full' />
        )}
      </div>
    </motion.div>
  );
}
