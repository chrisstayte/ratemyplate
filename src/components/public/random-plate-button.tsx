'use client';

import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getRandomPlate } from '@/app/actions';

export default function RandomPlateButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const plate = await getRandomPlate();
      if (plate) {
        router.push(`/${plate.state}/${plate.plateNumber}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={loading}
    >
      <Shuffle className={`size-4 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Finding...' : 'Random Plate'}
    </Button>
  );
}
