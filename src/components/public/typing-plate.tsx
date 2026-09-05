'use client';

import { useEffect, useState, useCallback } from 'react';
import { licensePlateFont } from '@/lib/fonts';

const TYPE_SPEED = 100;
const HOLD_TIME = 2000;
const DELETE_SPEED = 60;
const PAUSE_BETWEEN = 400;

export default function TypingPlate({ plates }: { plates: string[] }) {
  const [displayed, setDisplayed] = useState('');
  const [plateIndex, setPlateIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPlate = plates[plateIndex] ?? '';

  const nextPlate = useCallback(() => {
    setPlateIndex((prev) => (prev + 1) % plates.length);
  }, [plates.length]);

  useEffect(() => {
    if (plates.length === 0) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayed.length < currentPlate.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentPlate.slice(0, displayed.length + 1));
        }, TYPE_SPEED);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, HOLD_TIME);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, DELETE_SPEED);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          nextPlate();
        }, PAUSE_BETWEEN);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, currentPlate, nextPlate, plates.length]);

  return (
    <span className="flex items-center gap-3" aria-label="Plates from the community">
      <span className="eyebrow">Spotted on the road</span>
      <span aria-hidden="true" className={`${licensePlateFont.className} inline-block min-w-24 rounded border border-border bg-card px-2 py-1 text-lg leading-5 tracking-wider text-foreground`}>
        <span className="motion-safe:animate-pulse text-muted-foreground">/</span>
        {displayed}
        <span className="motion-safe:animate-pulse text-muted-foreground">/</span>
      </span>
    </span>
  );
}
